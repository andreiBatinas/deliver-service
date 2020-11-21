package validator

import (
	"encoding/json"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/lib/pq"
)

// ValidationError error structure
type ValidationError struct {
	Domain    string      `json:"domain"`
	Field     interface{} `json:"field"`
	Value     interface{} `json:"value"`
	Validator string      `json:"validator"`
	Param     string      `json:"param"`
}

func getDomainName(s interface{}) string {
	var domain string
	if t := reflect.TypeOf(s); t.Kind() == reflect.Ptr {
		domain = t.Elem().Name()
	} else {
		domain = t.Name()
	}

	return strings.ToLower(domain)
}

func getStringInBetween(str string, start string, end string) (result string) {
	s := strings.Index(str, start)
	if s == -1 {
		return
	}
	s += len(start)
	e := strings.Index(str, end)
	if e == -1 {
		return
	}
	return str[s:e]
}

// Validator struct
type Validator struct {
	errStack []*ValidationError
}

// NewValidator new validator instance
func NewValidator() *Validator {
	return &Validator{
		errStack: make([]*ValidationError, 0),
	}
}

// Validate error validation
func (v *Validator) Validate(s interface{}, structValidation validator.StructLevelFunc, structInfo interface{}) {

	domain := getDomainName(s)

	validate := validator.New()
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})

	if structValidation != nil {
		validate.RegisterStructValidation(structValidation, structInfo)
	}

	err := validate.Struct(s)
	if err != nil {

		for _, err := range err.(validator.ValidationErrors) {
			v.errStack = append(v.errStack, &ValidationError{
				Domain:    domain,
				Field:     err.Field(),
				Validator: err.Tag(),
				Value:     err.Value(),
				Param:     err.Param(),
			})
		}

	}
}

// FromSQL generate error from SQL
func (v *Validator) FromSQL(s interface{}, err error) {

	domain := getDomainName(s)

	var field, value string

	switch e := err.(type) {
	case *pq.Error:
		switch e.Detail {
		case "":
			field = "db-record"
			value = e.Message
		default:
			errSlice := strings.Split(e.Detail, "=")
			field = getStringInBetween(errSlice[0], "(", ")")
			value = getStringInBetween(errSlice[1], "(", ")")
		}
	default:
		field = "db-record"
		value = e.Error()
	}

	v.errStack = append(v.errStack, &ValidationError{
		Domain:    domain,
		Field:     field,
		Validator: "db",
		Value:     value,
		Param:     "",
	})

}

// SingleField generate manual error for one field
func (v *Validator) SingleField(s interface{}, field, value, validation, param string) {
	domain := getDomainName(s)
	v.errStack = append(v.errStack, &ValidationError{
		Domain:    domain,
		Field:     field,
		Validator: validation,
		Value:     value,
		Param:     param,
	})

}

// Combine errors from multiple domains
func (v *Validator) Combine(errorStack ...[]*ValidationError) {
	for _, e := range errorStack {
		v.errStack = append(v.errStack, e...)
	}
}

// ToJSON convert to json string
func (v *Validator) ToJSON() string {
	jsonByte, _ := json.Marshal(v.errStack)
	errString := string(jsonByte)

	return errString
}

// Errors return error stack
func (v *Validator) Errors() []*ValidationError {
	if 0 < len(v.errStack) {
		return v.errStack
	}
	return nil
}

// Is check if an error is in err stack
func (v *Validator) Is(domain, field, validator, value string) bool {
	for _, v := range v.errStack {
		if v.Domain == domain && v.Field == field && v.Validator == validator && v.Value == value {
			return true
		}
	}
	return false
}

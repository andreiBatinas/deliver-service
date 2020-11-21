package domain

import (
	"time"

	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
	_v "github.com/go-playground/validator/v10"
)

var (
	// AccountName name
	AccountName = "Account"
	// AccountsName name
	AccountsName = "Accounts"

	// KafkaAccountCreated topic key
	KafkaAccountCreated = "AccountCreated"

	// KafkaAccountUpdated topic key
	KafkaAccountUpdated = "AccountUpdated"

	// KafkaAccountRemoved topic key
	KafkaAccountRemoved = "AccountRemoved"
)

// Account model structure
type Account struct {
	ID                string    `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	Name              string    `json:"name" gorm:"column:name" validate:"required"`
	AddressFirstLine  string    `json:"addressFirstLine" gorm:"column:address_first_line"`
	AddressSecondLine string    `json:"addressSecondLine" gorm:"column:address_second_line"`
	PostalCode        string    `json:"postalCode" gorm:"column:postal_code"`
	City              string    `json:"city" gorm:"column:city"`
	Country           string    `json:"country" gorm:"column:country"`
	Status            string    `json:"status" gorm:"column:status"`
	StatusReason      string    `json:"statusReason" gorm:"column:status_reason"`
	CreatedAt         time.Time `json:"createdAt" gorm:"column:created_at"`
	UpdatedAt         time.Time `json:"updatedAt" gorm:"column:updated_at"`
	Teams             []*Team   `json:"teams"`
	Domains           []*Domain `json:"domains" gorm:"many2many:account.accounts_domains"`
	Users             []*User   `json:"users" gorm:"many2many:account.accounts_users"`
}

// AccountAuthenticate structure
type AccountAuthenticate struct {
	Email    string `validate:"required"`
	Password string `validate:"required"`
}

// TableName set domain with schema
func (Account) TableName() string {
	return "account.accounts"
}

// AccountValidation validate struct
func AccountValidation(sl _v.StructLevel) {
	account := sl.Current().Interface().(Account)
	sl.ReportError(account.Name, "account name", "Name", "validation", "")
}

// AccountUseCase usecase interface
type AccountUseCase interface {
	AccountRegister(in *Account) (*Account, error)
	AccountRemove(in *Account) (*Account, error)
	AccountAuthenticate(in *AccountAuthenticate) (*User, error)
	AccountGet(account *Account) (*Account, error)
	AccountUpdate(account *Account) (*Account, error)
}

// AccountRepository repository interface
// TODO: add replace for team,user,domain
type AccountRepository interface {
	Create(a *Account) *validator.Validator
	Remove(a *Account) *validator.Validator
	Update(a *Account) *validator.Validator
	GetByID(id string) (*Account, *validator.Validator)
	GetFullByID(id string) (*Account, *validator.Validator)
	GetByName(name string) (*Account, *validator.Validator)

	AddTeam(account *Account, team *Team) *validator.Validator
	RemoveTeam(account *Account, team *Team) *validator.Validator
	RemoveTeams(account *Account, teams *[]Team) *validator.Validator
	GetAllTeams(account *Account, teams *[]Team) *validator.Validator

	AddUser(account *Account, user *User) *validator.Validator
	RemoveUser(account *Account, user *User) *validator.Validator
	RemoveUsers(account *Account, users *[]User) *validator.Validator
	GetAllUsers(account *Account, users *[]User) *validator.Validator

	AddDomain(account *Account, d *Domain) *validator.Validator
	RemoveDomain(account *Account, d *Domain) *validator.Validator
	RemoveDomains(account *Account, d *[]Domain) *validator.Validator
	GetAllDomains(account *Account, d *[]Domain) *validator.Validator
}

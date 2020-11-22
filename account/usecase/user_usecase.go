package usecase

import (
	"crypto/sha256"
	"errors"
	"fmt"

	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/math"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
)

type userUseCase struct {
	userRepo domain.UserRepository
	roleRepo domain.RoleRepository
}

func (usecase *userUseCase) UserGet(in *domain.User) (*domain.User, error) {
	v := validator.NewValidator()

	if in.ID == "" {
		v.SingleField(domain.User{}, "ID", in.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	u, userGetByIDErrors := usecase.userRepo.GetByID(in.ID)
	if userGetByIDErrors != nil {
		return nil, errors.New(userGetByIDErrors.ToJSON())
	}

	return u, nil
}

func (usecase *userUseCase) UserRegister(user *domain.User) (*domain.User, error) {

	v := validator.NewValidator()

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	roleTeamMember, roleGetByNameErrors := usecase.roleRepo.GetByName(domain.RoleTeamMember)
	if roleGetByNameErrors != nil {
		return nil, errors.New(roleGetByNameErrors.ToJSON())
	}

	h := sha256.New()
	h.Write([]byte(user.Password))
	password := fmt.Sprintf("%x", h.Sum(nil))

	u := &domain.User{
		Email:    user.Email,
		Name:     user.Name,
		Phone:    user.Phone,
		Password: password,
		Token:    math.GenerateString(32),
		Roles:    []*domain.Role{roleTeamMember},
	}

	userCreateErrors := usecase.userRepo.Create(u)
	if userCreateErrors != nil {
		return nil, errors.New(userCreateErrors.ToJSON())
	}

	return u, nil
}

func (usecase *userUseCase) UserRemove(user *domain.User) (*domain.User, error) {

	v := validator.NewValidator()

	if user.ID == "" {
		v.SingleField(domain.User{}, "ID", user.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}
	u, userGetByIDErrors := usecase.userRepo.GetFullByID(user.ID)
	if userGetByIDErrors != nil {
		return nil, errors.New(userGetByIDErrors.ToJSON())
	}

	userRemoveErrors := usecase.userRepo.Remove(u)
	if userRemoveErrors != nil {
		return nil, errors.New(userRemoveErrors.ToJSON())
	}

	return u, nil
}

func (usecase *userUseCase) UserUpdate(user *domain.User) (*domain.User, error) {

	v := validator.NewValidator()

	if user.ID == "" {
		v.SingleField(domain.User{}, "ID", user.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	_, userGetByIDErrors := usecase.userRepo.GetByID(user.ID)
	if userGetByIDErrors != nil {
		return nil, errors.New(userGetByIDErrors.ToJSON())
	}
	u := &domain.User{
		ID:    user.ID,
		Email: user.Email,
		Name:  user.Name,
		Phone: user.Phone,
		Token: math.GenerateString(32),
	}

	userCreateErrors := usecase.userRepo.Update(u)
	if userCreateErrors != nil {
		return nil, errors.New(userCreateErrors.ToJSON())
	}

	return u, nil
}

func (usecase *userUseCase) UserChangePassword(user *domain.User, a *domain.UserChangePassword) (*domain.User, error) {
	v := validator.NewValidator()

	if user.ID == "" {
		v.SingleField(domain.User{}, "ID", user.ID, "required", "ID")
	}

	v.Validate(a, nil, nil)

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	u, userGetByIDErrors := usecase.userRepo.GetByID(user.ID)
	if userGetByIDErrors != nil {
		return nil, errors.New(userGetByIDErrors.ToJSON())
	}

	h := sha256.New()
	h.Write([]byte(a.OldPassword))
	password := fmt.Sprintf("%x", h.Sum(nil))

	if u.Password != password {
		v.SingleField(domain.User{}, "password", "", "eqfield", "user-pass")
		return nil, errors.New(v.ToJSON())
	}

	newHas := sha256.New()
	newHas.Write([]byte(a.NewPassword))
	newPassword := fmt.Sprintf("%x", newHas.Sum(nil))

	newUser := &domain.User{
		ID:       user.ID,
		Password: newPassword,
	}

	usecase.userRepo.Update(newUser)

	return u, nil

}

func (usecase *userUseCase) UserAuthenticate(in *domain.UserAuthenticate) (*domain.User, error) {
	v := validator.NewValidator()
	v.Validate(in, nil, nil)

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	r, userGetByEmailErrors := usecase.userRepo.GetByEmail(in.Email)
	if userGetByEmailErrors != nil {
		return nil, errors.New(userGetByEmailErrors.ToJSON())
	}

	h := sha256.New()
	h.Write([]byte(in.Password))
	password := fmt.Sprintf("%x", h.Sum(nil))

	if password != r.Password {
		v.SingleField(domain.User{}, "password", "", "eqfield", "user-pass")
		return nil, errors.New(v.ToJSON())
	}

	r, userGetByFullIDErrors := usecase.userRepo.GetFullByID(r.ID)
	if userGetByFullIDErrors != nil {
		return nil, errors.New(userGetByFullIDErrors.ToJSON())
	}

	return r, nil

}

// NewUserUseCase create Team usecase
func NewUserUseCase(
	userRepo domain.UserRepository,
	roleRepo domain.RoleRepository,
) domain.UserUseCase {
	return &userUseCase{
		userRepo: userRepo,
		roleRepo: roleRepo,
	}
}

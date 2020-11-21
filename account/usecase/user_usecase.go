package usecase

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"sort"

	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/math"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
)

type userUseCase struct {
	accountRepo    domain.AccountRepository
	userRepo       domain.UserRepository
	teamRepo       domain.TeamRepository
	roleRepo       domain.RoleRepository
	usersTeamsRepo domain.UsersTeamsRepository
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

	sort.Slice(u.Roles, func(i, j int) bool {
		return u.Roles[i].Level > u.Roles[j].Level
	})

	userDefaultTeam, userGetDefaultTeamErrors := usecase.usersTeamsRepo.UserGetDefaultTeam(&domain.UsersTeams{
		UserID: u.ID,
	})
	if userGetDefaultTeamErrors != nil {
		if false == userGetDefaultTeamErrors.Is("usersteams", "db-record", "db", "record not found") {
			return nil, errors.New(userGetDefaultTeamErrors.ToJSON())
		}
	}

	if userDefaultTeam != nil {
		for _, team := range u.Teams {
			if team.ID == userDefaultTeam.TeamID {
				team.IsDefault = true
			}
		}
	}

	return u, nil
}

func (usecase *userUseCase) UserCreate(account *domain.Account, user *domain.User) (*domain.User, error) {

	v := validator.NewValidator()

	if account.ID == "" {
		v.SingleField(domain.Account{}, "ID", account.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	_, accountGetByIDErrors := usecase.accountRepo.GetByID(account.ID)
	if accountGetByIDErrors != nil {
		return nil, errors.New(accountGetByIDErrors.ToJSON())
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
		Surname:  user.Surname,
		Phone:    user.Phone,
		Password: password,
		Token:    math.GenerateString(32),
		Roles:    []*domain.Role{roleTeamMember},
	}

	userCreateErrors := usecase.userRepo.Create(u)
	if userCreateErrors != nil {
		return nil, errors.New(userCreateErrors.ToJSON())
	}

	accountAddUserErrors := usecase.accountRepo.AddUser(account, u)
	if accountAddUserErrors != nil {
		return nil, errors.New(accountAddUserErrors.ToJSON())
	}

	return u, nil
}

func (usecase *userUseCase) UserRemove(account *domain.Account, user *domain.User) (*domain.User, error) {

	v := validator.NewValidator()

	if account.ID == "" {
		v.SingleField(domain.Account{}, "ID", account.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	a, accountGetByIDErrors := usecase.accountRepo.GetByID(account.ID)
	if accountGetByIDErrors != nil {
		return nil, errors.New(accountGetByIDErrors.ToJSON())
	}

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

	if u.Accounts[0].ID != account.ID {
		v.SingleField(domain.Account{}, "ID", account.ID, "eqfield", "ID")
		return nil, errors.New(v.ToJSON())
	}

	if u.Roles[0].Name == domain.RoleAccountOwner {
		v.SingleField(domain.Account{}, "ID", account.ID, "eqfield", "ID")
		return nil, errors.New(v.ToJSON())
	}

	if u.Teams != nil {
		for _, team := range u.Teams {
			teamRemoveUserErrors := usecase.teamRepo.RemoveUser(team, u)
			if teamRemoveUserErrors != nil {
				return nil, errors.New(teamRemoveUserErrors.ToJSON())
			}
		}
	}

	accountRemoveUserErrors := usecase.accountRepo.RemoveUser(a, u)
	if accountRemoveUserErrors != nil {
		return nil, errors.New(accountRemoveUserErrors.ToJSON())
	}

	userRemoveErrors := usecase.userRepo.Remove(u)
	if userRemoveErrors != nil {
		return nil, errors.New(userRemoveErrors.ToJSON())
	}

	return u, nil
}

func (usecase *userUseCase) UserUpdate(account *domain.Account, user *domain.User) (*domain.User, error) {

	v := validator.NewValidator()

	if account.ID == "" {
		v.SingleField(domain.Account{}, "ID", account.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	_, accountGetByIDErrors := usecase.accountRepo.GetByID(account.ID)
	if accountGetByIDErrors != nil {
		return nil, errors.New(accountGetByIDErrors.ToJSON())
	}

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
		ID:      user.ID,
		Email:   user.Email,
		Name:    user.Name,
		Surname: user.Surname,
		Phone:   user.Phone,
		Token:   math.GenerateString(32),
	}

	userCreateErrors := usecase.userRepo.Update(u)
	if userCreateErrors != nil {
		return nil, errors.New(userCreateErrors.ToJSON())
	}

	return u, nil
}

func (usecase *userUseCase) UserList(in *domain.Account) ([]domain.User, error) {

	v := validator.NewValidator()

	if in.ID == "" {
		v.SingleField(domain.User{}, "ID", in.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	users := make([]domain.User, 0)
	accountGetAllUsersErrors := usecase.accountRepo.GetAllUsers(in, &users)
	if accountGetAllUsersErrors != nil {
		return nil, errors.New(accountGetAllUsersErrors.ToJSON())
	}

	return users, nil
}

func (usecase *userUseCase) UserAssignTeams(account *domain.Account, user *domain.User, teamList []*domain.Team) (*domain.User, error) {
	v := validator.NewValidator()

	if account.ID == "" {
		v.SingleField(domain.Account{}, "ID", account.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	_, accountGetByIDErrors := usecase.accountRepo.GetByID(account.ID)
	if accountGetByIDErrors != nil {
		return nil, errors.New(accountGetByIDErrors.ToJSON())
	}

	if user.ID == "" {
		v.SingleField(domain.User{}, "ID", user.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	u, userGetByIDErrors := usecase.userRepo.GetByID(user.ID)
	if userGetByIDErrors != nil {
		return nil, errors.New(userGetByIDErrors.ToJSON())
	}

	for _, team := range teamList {
		if team.ID == "" {
			continue
		}

		t, teamGetByIDErrors := usecase.teamRepo.GetByID(team.ID)
		if teamGetByIDErrors != nil {
			continue
		}

		teamAddUserErrors := usecase.teamRepo.AddUser(t, u)
		if teamAddUserErrors != nil {
			v.Combine(teamAddUserErrors.Errors())
		}
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	return u, nil

}

func (usecase *userUseCase) UserRemoveTeams(account *domain.Account, user *domain.User, teamList []*domain.Team) (*domain.User, error) {
	v := validator.NewValidator()

	if account.ID == "" {
		v.SingleField(domain.Account{}, "ID", account.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	_, accountGetByIDErrors := usecase.accountRepo.GetByID(account.ID)
	if accountGetByIDErrors != nil {
		return nil, errors.New(accountGetByIDErrors.ToJSON())
	}

	if user.ID == "" {
		v.SingleField(domain.User{}, "ID", user.ID, "required", "ID")
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	u, userGetByIDErrors := usecase.userRepo.GetByID(user.ID)
	if userGetByIDErrors != nil {
		return nil, errors.New(userGetByIDErrors.ToJSON())
	}

	for _, team := range teamList {
		if team.ID == "" {
			continue
		}

		t, teamGetByIDErrors := usecase.teamRepo.GetByID(team.ID)
		if teamGetByIDErrors != nil {
			continue
		}

		teamAddUserErrors := usecase.teamRepo.RemoveUser(t, u)
		if teamAddUserErrors != nil {
			v.Combine(teamAddUserErrors.Errors())
		}
	}

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	return u, nil
}

func (usecase *userUseCase) UserSetDefaultTeam(account *domain.Account, user *domain.User, team *domain.Team) (*domain.User, error) {
	v := validator.NewValidator()

	if user.ID == "" {
		v.SingleField(domain.User{}, "ID", user.ID, "required", "ID")
		return nil, errors.New(v.ToJSON())
	}

	if team.ID == "" {
		v.SingleField(domain.Team{}, "ID", team.ID, "required", "ID")
		return nil, errors.New(v.ToJSON())
	}

	if account.ID == "" {
		v.SingleField(domain.Account{}, "ID", account.ID, "required", "")
		return nil, errors.New(v.ToJSON())
	}

	_, teamGetByAccountIDError := usecase.teamRepo.GetByAccountID(team.ID, account.ID)
	if teamGetByAccountIDError != nil {
		return nil, errors.New(teamGetByAccountIDError.ToJSON())
	}

	ut := &domain.UsersTeams{
		TeamID:    team.ID,
		UserID:    user.ID,
		IsDefault: true,
	}

	userSetDefaultError := usecase.usersTeamsRepo.UserSetDefault(ut)
	if userSetDefaultError != nil {
		return nil, errors.New(userSetDefaultError.ToJSON())
	}

	return user, nil
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

// NewUserUseCase create Team usecase
func NewUserUseCase(
	accountRepo domain.AccountRepository,
	userRepo domain.UserRepository,
	teamRepo domain.TeamRepository,
	roleRepo domain.RoleRepository,
	usersTeamsRepo domain.UsersTeamsRepository,
) domain.UserUseCase {
	return &userUseCase{
		userRepo:       userRepo,
		accountRepo:    accountRepo,
		teamRepo:       teamRepo,
		roleRepo:       roleRepo,
		usersTeamsRepo: usersTeamsRepo,
	}
}

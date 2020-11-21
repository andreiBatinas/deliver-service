package usecase

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/math"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
)

type accountUseCase struct {
	accountRepo    domain.AccountRepository
	userRepo       domain.UserRepository
	roleRepo       domain.RoleRepository
	teamRepo       domain.TeamRepository
	domainRepo     domain.DomainRepository
	usersTeamsRepo domain.UsersTeamsRepository
}

func (usecase *accountUseCase) AccountGet(account *domain.Account) (*domain.Account, error) {
	v := validator.NewValidator()

	if account.ID == "" {
		v.SingleField(domain.Account{}, "ID", account.ID, "required", "")
		return nil, errors.New(v.ToJSON())
	}

	a, accountGetByIDError := usecase.accountRepo.GetByID(account.ID)
	if accountGetByIDError != nil {
		return nil, errors.New(accountGetByIDError.ToJSON())
	}

	return a, nil
}

func (usecase *accountUseCase) AccountUpdate(account *domain.Account) (*domain.Account, error) {
	v := validator.NewValidator()

	if account.ID == "" {
		v.SingleField(domain.Account{}, "ID", account.ID, "required", "")
		return nil, errors.New(v.ToJSON())
	}

	_, accountGetByIDError := usecase.accountRepo.GetByID(account.ID)
	if accountGetByIDError != nil {
		return nil, errors.New(accountGetByIDError.ToJSON())
	}

	accountUpdateError := usecase.accountRepo.Update(account)
	if accountUpdateError != nil {
		return nil, errors.New(accountUpdateError.ToJSON())
	}

	return account, nil
}

func (usecase *accountUseCase) AccountAuthenticate(in *domain.AccountAuthenticate) (*domain.User, error) {
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

	if len(r.Teams) == 0 {
		r.Teams = make([]*domain.Team, 0)
	}

	return r, nil

}

func (usecase *accountUseCase) AccountRegister(in *domain.Account) (*domain.Account, error) {

	// Validate incoming data
	v := validator.NewValidator()
	v.Validate(in, nil, nil)
	v.Validate(in.Users[0], nil, nil)
	v.Validate(in.Domains[0], nil, nil)

	if v.Errors() != nil {
		return nil, errors.New(v.ToJSON())
	}

	// Get roleAccountOwner
	roleAccountOwner, roleGetByNameErrors := usecase.roleRepo.GetByName(domain.RoleAccountOwner)
	if roleGetByNameErrors != nil {
		return nil, errors.New(roleGetByNameErrors.ToJSON())
	}

	// Get roleTeamMember
	roleTeamMember, roleGetByNameErrors := usecase.roleRepo.GetByName(domain.RoleTeamMember)
	if roleGetByNameErrors != nil {
		return nil, errors.New(roleGetByNameErrors.ToJSON())
	}

	// Generate sha256 password hash
	h := sha256.New()
	h.Write([]byte(in.Users[0].Password))
	password := fmt.Sprintf("%x", h.Sum(nil))

	// Prepare first domain and alias
	domainName := in.Domains[0].Name
	domainNameSlug := strings.Replace(domainName, "http://", "", 1)
	domainNameSlug = strings.Replace(domainNameSlug, "https://", "", 1)
	domainNameSlug = strings.ReplaceAll(domainNameSlug, ".", "-")

	whisbiLiveDomainName := strings.Join([]string{domainNameSlug, "whisbi.live"}, ".")
	d := []*domain.Domain{
		{
			Name:   in.Domains[0].Name,
			IsLive: false,
		},
		{
			Name:   whisbiLiveDomainName,
			IsLive: true,
		},
	}

	// Prepare user structure
	u := &domain.User{
		Email:    in.Users[0].Email,
		Name:     in.Users[0].Name,
		Surname:  in.Users[0].Surname,
		Phone:    in.Users[0].Phone,
		Password: password,
		Token:    math.GenerateString(32),
		Roles:    []*domain.Role{roleAccountOwner, roleTeamMember},
	}

	// Prepare account struct
	a := &domain.Account{
		AddressFirstLine:  in.AddressFirstLine,
		AddressSecondLine: in.AddressSecondLine,
		City:              in.City,
		Country:           in.Country,
		Name:              in.Name,
		PostalCode:        in.PostalCode,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),

		Domains: d,
		Users:   []*domain.User{u},
	}

	// Create account, team, user, assign user to role
	accountErrors := usecase.accountRepo.Create(a)
	if accountErrors != nil {
		return nil, errors.New(accountErrors.ToJSON())
	}

	// Prepare team 0
	var whisbiLiveDomainID string
	for _, domain := range a.Domains {
		if domain.Name == whisbiLiveDomainName {
			whisbiLiveDomainID = domain.ID
		}
	}
	t := &domain.Team{
		AccountID: a.ID,
		DomainID:  whisbiLiveDomainID,
		Name:      strings.Join([]string{in.Name, "Team 01"}, "-"),
	}

	teamCreateErrors := usecase.teamRepo.Create(t)
	if teamCreateErrors != nil {
		return nil, errors.New(teamCreateErrors.ToJSON())
	}

	// Assign team to account
	accountAddTeamErrors := usecase.accountRepo.AddTeam(a, t)
	if accountAddTeamErrors != nil {
		return nil, errors.New(accountAddTeamErrors.ToJSON())
	}

	// Assign user to team
	teamAddUserErrors := usecase.teamRepo.AddUser(t, a.Users[0])
	if teamAddUserErrors != nil {
		return nil, errors.New(teamAddUserErrors.ToJSON())
	}

	ut := &domain.UsersTeams{
		TeamID:    t.ID,
		IsDefault: true,
	}

	// set team as default
	teamSetDefaultErrors := usecase.usersTeamsRepo.TeamSetDefault(ut)
	if teamSetDefaultErrors != nil {
		return nil, errors.New(teamSetDefaultErrors.ToJSON())
	}

	return a, nil
}

func (usecase *accountUseCase) AccountRemove(in *domain.Account) (*domain.Account, error) {

	a, accountGetByIDErrors := usecase.accountRepo.GetFullByID(in.ID)
	if accountGetByIDErrors != nil {
		if false == accountGetByIDErrors.Is("account", "db-record", "db", "record not found") {
			return nil, errors.New(accountGetByIDErrors.ToJSON())
		}
	}

	if a == nil {
		return nil, errors.New(accountGetByIDErrors.ToJSON())
	}

	teams := make([]domain.Team, 0)
	accountGetAllTeamsErrors := usecase.accountRepo.GetAllTeams(a, &teams)
	if accountGetAllTeamsErrors != nil {
		return nil, errors.New(accountGetAllTeamsErrors.ToJSON())
	}

	users := make([]domain.User, 0)
	accountGetAllUsersErrors := usecase.accountRepo.GetAllUsers(a, &users)
	if accountGetAllUsersErrors != nil {
		return nil, errors.New(accountGetAllTeamsErrors.ToJSON())
	}

	domains := make([]domain.Domain, 0)
	accountGetAllDomainsErrors := usecase.accountRepo.GetAllDomains(a, &domains)
	if accountGetAllDomainsErrors != nil {
		return nil, errors.New(accountGetAllDomainsErrors.ToJSON())
	}

	accountRemoveTeamsErrors := usecase.accountRepo.RemoveTeams(a, &teams)
	if accountRemoveTeamsErrors != nil {
		return nil, errors.New(accountRemoveTeamsErrors.ToJSON())
	}

	accountRemoveDomainsErrors := usecase.accountRepo.RemoveDomains(a, &domains)
	if accountRemoveDomainsErrors != nil {
		return nil, errors.New(accountRemoveDomainsErrors.ToJSON())
	}

	domainErrors := validator.NewValidator()
	for _, d := range domains {
		domainRemoveErrors := usecase.domainRepo.Remove(&d)
		if domainRemoveErrors != nil {
			domainErrors.Combine(domainRemoveErrors.Errors())
		}
	}

	if domainErrors.Errors() != nil {
		return nil, errors.New(domainErrors.ToJSON())
	}

	teamErrors := validator.NewValidator()
	for _, t := range teams {
		teamRemoveUsersErrors := usecase.teamRepo.RemoveUsers(&t, &users)
		if teamRemoveUsersErrors != nil {
			teamErrors.Combine(teamRemoveUsersErrors.Errors())
		}
		teamRemoveErrors := usecase.teamRepo.Remove(&t)
		if teamRemoveErrors != nil {
			teamErrors.Combine(teamRemoveErrors.Errors())
		}
	}

	if teamErrors.Errors() != nil {
		return nil, errors.New(teamErrors.ToJSON())
	}

	accountRemoveUsersErrors := usecase.accountRepo.RemoveUsers(a, &users)
	if accountRemoveUsersErrors != nil {
		return nil, errors.New(accountRemoveUsersErrors.ToJSON())
	}

	userErrors := validator.NewValidator()
	for _, u := range users {
		userRemoveErrors := usecase.userRepo.Remove(&u)
		if userRemoveErrors != nil {
			userErrors.Combine(userRemoveErrors.Errors())
		}
	}

	if userErrors.Errors() != nil {
		return nil, errors.New(userErrors.ToJSON())
	}

	accountErrors := usecase.accountRepo.Remove(a)
	if accountErrors != nil {
		return nil, errors.New(accountErrors.ToJSON())
	}

	return a, nil
}

// NewAccountUseCase create use case
func NewAccountUseCase(
	accountRepo domain.AccountRepository,
	userRepo domain.UserRepository,
	roleRepo domain.RoleRepository,
	teamRepo domain.TeamRepository,
	domainRepo domain.DomainRepository,
	usersTeamsRepo domain.UsersTeamsRepository,
) domain.AccountUseCase {
	return &accountUseCase{
		accountRepo:    accountRepo,
		roleRepo:       roleRepo,
		userRepo:       userRepo,
		teamRepo:       teamRepo,
		domainRepo:     domainRepo,
		usersTeamsRepo: usersTeamsRepo,
	}
}

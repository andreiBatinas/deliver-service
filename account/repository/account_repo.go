package repository

import (
	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/database"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
	"github.com/jinzhu/gorm"
)

type accountRepository struct {
	DB *gorm.DB
}

func (repo *accountRepository) GetByID(id string) (*domain.Account, *validator.Validator) {
	account := &domain.Account{}
	v := validator.NewValidator()
	if err := repo.DB.Where("id = ?", id).First(&account).Error; err != nil {
		v.FromSQL(account, err)
		return nil, v
	}

	return account, nil
}
func (repo *accountRepository) GetFullByID(id string) (*domain.Account, *validator.Validator) {
	account := &domain.Account{}
	v := validator.NewValidator()
	if err := repo.DB.
		Preload(domain.DomainsName).
		Preload(domain.TeamsName).
		Preload(domain.UsersName).
		Where("id = ?", id).
		First(&account).Error; err != nil {
		v.FromSQL(account, err)
		return nil, v
	}

	return account, nil
}

func (repo *accountRepository) GetByName(name string) (*domain.Account, *validator.Validator) {
	account := &domain.Account{}
	v := validator.NewValidator()
	if err := repo.DB.Where("name = ?", name).First(&account).Error; err != nil {
		v.FromSQL(account, err)
		return nil, v
	}

	return account, nil
}

func (repo *accountRepository) Create(account *domain.Account) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Create(&account).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) Remove(account *domain.Account) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Delete(&account).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) Update(d *domain.Account) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&d).Updates(&d).Error; err != nil {
		v.FromSQL(domain.Domain{}, err)
		return v
	}

	return nil
}

func (repo *accountRepository) AddTeam(account *domain.Account, team *domain.Team) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.TeamsName).Append(team).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) RemoveTeam(account *domain.Account, team *domain.Team) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.TeamsName).Delete(team).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) RemoveTeams(account *domain.Account, teams *[]domain.Team) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.TeamsName).Delete(teams).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) GetAllTeams(account *domain.Account, teams *[]domain.Team) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).
		Preload(domain.DomainName).
		Association(domain.TeamsName).Find(&teams).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) AddUser(account *domain.Account, user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.UsersName).Append(user).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) RemoveUser(account *domain.Account, user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.UsersName).Delete(user).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) RemoveUsers(account *domain.Account, users *[]domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.UsersName).Delete(users).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) GetAllUsers(account *domain.Account, users *[]domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.
		Preload(domain.RolesName).
		Preload(domain.TeamsName).
		Model(&account).Association(domain.UsersName).Find(&users).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) AddDomain(account *domain.Account, d *domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.DomainsName).Append(d).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) RemoveDomain(account *domain.Account, d *domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.DomainsName).Delete(d).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) RemoveDomains(account *domain.Account, d *[]domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.DomainsName).Delete(d).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

func (repo *accountRepository) GetAllDomains(account *domain.Account, d *[]domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&account).Association(domain.DomainsName).Find(&d).Error; err != nil {
		v.FromSQL(account, err)
		return v
	}
	return nil
}

// NewAccountRepository account repository
func NewAccountRepository() domain.AccountRepository {
	db := &accountRepository{
		DB: database.DB.Connection,
	}

	return db
}

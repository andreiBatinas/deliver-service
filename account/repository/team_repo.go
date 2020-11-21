package repository

import (
	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/database"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
	"github.com/jinzhu/gorm"
)

type teamRepository struct {
	DB *gorm.DB
}

func (repo *teamRepository) GetByID(id string) (*domain.Team, *validator.Validator) {
	team := &domain.Team{}
	v := validator.NewValidator()
	if err := repo.DB.
		Preload(domain.DomainName).
		Preload(domain.UsersName).
		Where("id = ?", id).First(&team).Error; err != nil {
		v.FromSQL(team, err)
		return nil, v
	}

	return team, nil
}

func (repo *teamRepository) GetAllByAccountID(accountID string) ([]*domain.Team, *validator.Validator) {
	var teams []*domain.Team
	v := validator.NewValidator()
	if err := repo.DB.Where("account_id = ?", accountID).Find(teams).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return nil, v
	}

	return teams, nil
}

func (repo *teamRepository) GetByAccountID(id, accountID string) (*domain.Team, *validator.Validator) {
	team := &domain.Team{}
	v := validator.NewValidator()
	if err := repo.DB.
		Where("id = ?", id).
		Where("account_id = ?", accountID).First(team).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return nil, v
	}

	return team, nil
}

func (repo *teamRepository) Create(team *domain.Team) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Create(&team).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return v
	}
	return nil
}

func (repo *teamRepository) Remove(team *domain.Team) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Delete(&team).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return v
	}
	return nil
}

func (repo *teamRepository) Update(team *domain.Team) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&team).Updates(&team).Error; err != nil {
		v.FromSQL(team, err)
		return v
	}

	return nil
}

func (repo *teamRepository) AddUser(team *domain.Team, user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(team).Association(domain.UsersName).Append(user).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return v
	}
	return nil
}

func (repo *teamRepository) RemoveUser(team *domain.Team, user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(team).Association(domain.UsersName).Delete(user).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return v
	}
	return nil
}

func (repo *teamRepository) RemoveUsers(team *domain.Team, user *[]domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(team).Association(domain.UsersName).Delete(user).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return v
	}
	return nil
}

func (repo *teamRepository) GetAllUsers(team *domain.Team, user *[]domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&team).Association(domain.UsersName).Find(&user).Error; err != nil {
		v.FromSQL(team, err)
		return v
	}
	return nil
}

func (repo *teamRepository) AddDomain(team *domain.Team, d *domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(team).Association(domain.UsersName).Append(d).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return v
	}
	return nil
}

func (repo *teamRepository) RemoveDomain(team *domain.Team, d *domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(team).Association(domain.UsersName).Delete(d).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return v
	}
	return nil
}

func (repo *teamRepository) RemoveDomains(team *domain.Team, d *[]domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(team).Association(domain.UsersName).Delete(d).Error; err != nil {
		v.FromSQL(domain.Team{}, err)
		return v
	}
	return nil
}

func (repo *teamRepository) GetAllDomains(team *domain.Team, d *[]domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&team).Association(domain.UsersName).Find(&d).Error; err != nil {
		v.FromSQL(team, err)
		return v
	}
	return nil
}

// NewTeamRepository account repository
func NewTeamRepository() domain.TeamRepository {
	db := &teamRepository{
		DB: database.DB.Connection,
	}

	return db
}

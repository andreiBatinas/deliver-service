package repository

import (
	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/database"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
	"github.com/jinzhu/gorm"
)

type domainRepository struct {
	DB *gorm.DB
}

func (repo *domainRepository) GetByID(id string, accountID string) (*domain.Domain, *validator.Validator) {
	d := &domain.Domain{}
	v := validator.NewValidator()
	if err := repo.DB.Model(&domain.Account{
		ID: accountID,
	}).Where("domains.id = ?", id).Association(domain.DomainsName).Find(&d).Error; err != nil {
		v.FromSQL(domain.Domain{}, err)
		return nil, v
	}

	return d, nil
}

func (repo *domainRepository) GetByName(accountID string, domainName string) (*domain.Domain, *validator.Validator) {
	d := &domain.Domain{}
	v := validator.NewValidator()
	if err := repo.DB.Model(&domain.Account{
		ID: accountID,
	}).Where("domains.name = ?", domainName).Association(domain.DomainsName).Find(&d).Error; err != nil {
		v.FromSQL(domain.Domain{}, err)
		return nil, v
	}

	return d, nil
}

func (repo *domainRepository) DomainsGetTeams(inDomain *domain.Domain) (*domain.Domain, *validator.Validator) {
	d := &domain.Domain{}
	v := validator.NewValidator()
	if err := repo.DB.Model(&inDomain).
		Preload(domain.TeamsName).
		Where("domains.id = ?", inDomain.ID).
		First(&d).Error; err != nil {
		v.FromSQL(domain.Domain{}, err)
		return nil, v
	}

	return d, nil
}

func (repo *domainRepository) GetByAccountID(inDomain *domain.Domain) ([]*domain.Domain, *validator.Validator) {
	d := make([]*domain.Domain, 0)
	v := validator.NewValidator()
	if err := repo.DB.Model(&domain.Account{
		ID: inDomain.Accounts[0].ID,
	}).
		Where("domains.is_live = ?", inDomain.IsLive).
		Association(domain.DomainsName).Find(&d).Error; err != nil {
		v.FromSQL(domain.Domain{}, err)
		return nil, v
	}

	return d, nil
}

func (repo *domainRepository) Create(d *domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Create(&d).Error; err != nil {
		v.FromSQL(domain.Domain{}, err)
		return v
	}

	return nil
}

func (repo *domainRepository) Update(d *domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&d).Updates(&d).Error; err != nil {
		v.FromSQL(domain.Domain{}, err)
		return v
	}

	return nil
}

func (repo *domainRepository) Remove(d *domain.Domain) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Delete(&d).Error; err != nil {
		v.FromSQL(domain.Domain{}, err)
		return v
	}
	return nil
}

// NewDomainRepository account repository
func NewDomainRepository() domain.DomainRepository {
	db := &domainRepository{
		DB: database.DB.Connection,
	}

	return db
}

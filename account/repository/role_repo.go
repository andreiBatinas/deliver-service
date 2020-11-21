package repository

import (
	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/database"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
	"github.com/jinzhu/gorm"
)

type roleRepository struct {
	DB *gorm.DB
}

func (repo *roleRepository) GetByID(id string) (*domain.Role, *validator.Validator) {
	role := &domain.Role{}
	v := validator.NewValidator()
	if err := repo.DB.Where("id = ?", id).First(&role).Error; err != nil {
		v.FromSQL(role, err)
		return nil, v
	}
	return role, nil
}

func (repo *roleRepository) GetByName(name string) (*domain.Role, *validator.Validator) {
	role := &domain.Role{}
	v := validator.NewValidator()
	if err := repo.DB.Where("name = ?", name).First(&role).Error; err != nil {
		v.FromSQL(role, err)
		return nil, v
	}

	return role, nil
}

func (repo *roleRepository) AddUser(role *domain.Role, user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(role).Association(domain.UsersName).Append(user).Error; err != nil {
		v.FromSQL(role, err)
		return v
	}
	return nil
}

func (repo *roleRepository) RemoveUser(role *domain.Role, user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(role).Association(domain.UsersName).Delete(user).Error; err != nil {
		v.FromSQL(role, err)
		return v
	}
	return nil
}

// NewRoleRepository account repository
func NewRoleRepository() domain.RoleRepository {
	db := &roleRepository{
		DB: database.DB.Connection,
	}

	return db
}

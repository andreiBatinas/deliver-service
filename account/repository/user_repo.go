package repository

import (
	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/database"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
	"github.com/jinzhu/gorm"
)

type userRepository struct {
	DB *gorm.DB
}

func (repo *userRepository) GetByEmail(email string) (*domain.User, *validator.Validator) {
	user := &domain.User{}
	v := validator.NewValidator()
	if err := repo.DB.Where("email = ?", email).First(&user).Error; err != nil {
		v.FromSQL(domain.User{}, err)
		return nil, v
	}

	return user, nil
}

func (repo *userRepository) GetFullByID(id string) (*domain.User, *validator.Validator) {
	user := &domain.User{}
	v := validator.NewValidator()
	if err := repo.DB.
		Preload(domain.RolesName).
		Where("id = ?", id).First(&user).Error; err != nil {
		v.FromSQL(domain.User{}, err)
		return nil, v
	}

	return user, nil
}

func (repo *userRepository) GetByID(id string) (*domain.User, *validator.Validator) {
	user := &domain.User{}
	v := validator.NewValidator()
	if err := repo.DB.
		Preload(domain.RolesName).
		Where("id = ?", id).First(&user).Error; err != nil {
		v.FromSQL(domain.User{}, err)
		return nil, v
	}

	return user, nil
}

func (repo *userRepository) Create(user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Create(&user).Error; err != nil {
		v.FromSQL(domain.User{}, err)
		return v
	}

	return nil
}

func (repo *userRepository) Remove(user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Delete(&user).Error; err != nil {
		v.FromSQL(domain.User{}, err)
		return v
	}
	return nil
}

func (repo *userRepository) Update(user *domain.User) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&user).Updates(&user).Error; err != nil {
		v.FromSQL(user, err)
		return v
	}

	return nil
}

// NewUserRepository account repository
func NewUserRepository() domain.UserRepository {
	db := &userRepository{
		DB: database.DB.Connection,
	}

	return db
}

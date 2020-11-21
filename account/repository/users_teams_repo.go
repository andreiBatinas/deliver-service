package repository

import (
	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/database"
	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
	"github.com/jinzhu/gorm"
)

type usersTeamsRepository struct {
	DB *gorm.DB
}

func (repo *usersTeamsRepository) UserSetDefault(userTeams *domain.UsersTeams) *validator.Validator {
	v := validator.NewValidator()
	if err := repo.DB.Model(&domain.UsersTeams{}).
		Where("user_id = ?", userTeams.UserID).
		Update("is_default", false).
		Error; err != nil {
		v.FromSQL(domain.UsersTeams{}, err)
		return v
	}

	if err := repo.DB.Model(&userTeams).
		Where("user_id = ?", userTeams.UserID).
		Where("team_id = ?", userTeams.TeamID).
		Update("is_default", true).
		Error; err != nil {
		v.FromSQL(domain.User{}, err)
		return v
	}

	return nil
}

func (repo *usersTeamsRepository) TeamSetDefault(userTeams *domain.UsersTeams) *validator.Validator {
	v := validator.NewValidator()

	if err := repo.DB.Model(&userTeams).Where("team_id = ?", userTeams.TeamID).Updates(&domain.UsersTeams{IsDefault: false}).Error; err != nil {
		v.FromSQL(domain.UsersTeams{}, err)
		return v
	}

	if err := repo.DB.Model(&userTeams).Where("team_id = ?", userTeams.TeamID).Updates(&userTeams).Error; err != nil {
		v.FromSQL(domain.User{}, err)
		return v
	}
	return nil
}

func (repo *usersTeamsRepository) UserHasTeam(userTeams *domain.UsersTeams) *validator.Validator {
	v := validator.NewValidator()
	var count int64
	if err := repo.DB.Model(&userTeams).Where("user_id = ?", userTeams.UserID).Count(&count).Error; err != nil {
		v.FromSQL(domain.UsersTeams{}, err)
		return v
	}

	if count == 0 {
		v.SingleField(domain.UsersTeams{}, "User", userTeams.UserID, "empty", "not in team")
		return v
	}
	return nil
}

func (repo *usersTeamsRepository) UserGetDefaultTeam(userTeams *domain.UsersTeams) (*domain.UsersTeams, *validator.Validator) {
	v := validator.NewValidator()
	if err := repo.DB.
		Where("user_id = ?", userTeams.UserID).
		Where("is_default = ?", true).
		First(&userTeams).Error; err != nil {
		v.FromSQL(domain.UsersTeams{}, err)
		return nil, v
	}
	return userTeams, nil
}

// NewUsersTeamsRepository  repository
func NewUsersTeamsRepository() domain.UsersTeamsRepository {
	db := &usersTeamsRepository{
		DB: database.DB.Connection,
	}

	return db
}

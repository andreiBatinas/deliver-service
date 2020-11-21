package domain

import "github.com/andreiBatinas/deliver-service/infrastructure/validator"

// UsersTeams entity
type UsersTeams struct {
	ID        string `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	UserID    string `json:"userId" gorm:"column:user_id"`
	TeamID    string `json:"teamId" gorm:"column:team_id"`
	IsDefault bool   `json:"isDefault" gorm:"column:is_default"`
}

// TableName name of table
func (UsersTeams) TableName() string {
	return "account.users_teams"
}

// UsersTeamsRepository repository interface
type UsersTeamsRepository interface {
	UserSetDefault(d *UsersTeams) *validator.Validator
	UserHasTeam(d *UsersTeams) *validator.Validator
	UserGetDefaultTeam(d *UsersTeams) (*UsersTeams, *validator.Validator)
	TeamSetDefault(d *UsersTeams) *validator.Validator
}

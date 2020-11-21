package domain

import (
	"time"

	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
	_v "github.com/go-playground/validator/v10"
)

var (
	// UserName name
	UserName = "User"
	// UsersName name
	UsersName = "Users"

	// KafkaUserCreated topic key
	KafkaUserCreated = "UserCreated"

	// KafkaUserUpdated topic key
	KafkaUserUpdated = "UserUpdated"

	// KafkaUserRemoved topic key
	KafkaUserRemoved = "UserRemoved"
)

// User model structure
type User struct {
	ID           string     `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	Email        string     `json:"email" gorm:"column:email" validate:"required,email"`
	Password     string     `json:"password" gorm:"column:password" validate:"required,min=6,containsany=!@#$%^&*()_"`
	Name         string     `json:"name" gorm:"column:name" validate:"required"`
	Surname      string     `json:"surname" gorm:"column:surname" validate:"required"`
	Phone        string     `json:"phone" gorm:"column:phone" validate:"required"`
	Token        string     `json:"token" gorm:"column:token"`
	Status       string     `json:"status" gorm:"column:status"`
	StatusReason string     `json:"statusReason" gorm:"column:status_reason"`
	CreatedAt    time.Time  `json:"createdAt" gorm:"column:created_at"`
	UpdatedAt    time.Time  `json:"updatedAt" gorm:"column:updated_at"`
	Accounts     []*Account `json:"accounts" gorm:"many2many:account.accounts_users"`
	Roles        []*Role    `json:"roles" gorm:"many2many:account.users_roles"`
	Teams        []*Team    `json:"teams" gorm:"many2many:account.users_teams"`
}

// TableName set domain with schema
func (User) TableName() string {
	return "account.users"
}

// UserValidation validate struct
func UserValidation(sl _v.StructLevel) {
	user := sl.Current().Interface().(User)
	if 0 < len(user.Password) {
		sl.ReportError(user.Password, "password", "Password", "validation", "")
	}
}

// UserChangePassword structure
type UserChangePassword struct {
	OldPassword string `json:"oldPassword" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required,min=6,containsany=!@#$%^&*()_"`
}

// UserUseCase usecase interface
type UserUseCase interface {
	UserGet(user *User) (*User, error)
	UserList(account *Account) ([]User, error)
	UserCreate(account *Account, user *User) (*User, error)
	UserUpdate(account *Account, user *User) (*User, error)
	UserRemove(account *Account, user *User) (*User, error)
	UserAssignTeams(account *Account, user *User, teamList []*Team) (*User, error)
	UserRemoveTeams(account *Account, user *User, teamList []*Team) (*User, error)
	UserSetDefaultTeam(account *Account, user *User, team *Team) (*User, error)
	UserChangePassword(user *User, in *UserChangePassword) (*User, error)
}

// UserRepository repository interface
type UserRepository interface {
	Create(user *User) *validator.Validator
	Remove(user *User) *validator.Validator
	GetByID(id string) (*User, *validator.Validator)
	GetFullByID(id string) (*User, *validator.Validator)
	GetByEmail(email string) (*User, *validator.Validator)
	Update(team *User) *validator.Validator
}

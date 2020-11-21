package domain

import "github.com/andreiBatinas/deliver-service/infrastructure/validator"

var (
	// RoleName "Role"
	RoleName = "Role"

	// RolesName "Roles"
	RolesName = "Roles"

	// RoleSuperAdmin "superAdmin"
	RoleSuperAdmin = "superAdmin"

	// RoleAccountOwner "accountOwner"
	RoleAccountOwner = "accountOwner"

	// RoleAccountAdmin "accountAdmin"
	RoleAccountAdmin = "accountAdmin"

	// RoleTeamMember "teamMember"
	RoleTeamMember = "teamMember"

	// RolePublicUser "publicUser"
	RolePublicUser = "publicUser"

	// KafkaRoleCreated topic key
	KafkaRoleCreated = "RoleCreated"

	// KafkaRoleUpdated topic key
	KafkaRoleUpdated = "RoleUpdated"

	// KafkaRoleRemoved topic key
	KafkaRoleRemoved = "RoleRemoved"
)

// Role model structure
type Role struct {
	ID    string  `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	Name  string  `json:"name" gorm:"column:name"`
	Level int     `json:"level" gorm:"column:level"`
	Users []*User `json:"users" gorm:"many2many:account.users_roles"`
}

// TableName set domain with schema
func (Role) TableName() string {
	return "account.roles"
}

// RoleRepository repository interface
type RoleRepository interface {
	GetByID(id string) (*Role, *validator.Validator)
	GetByName(name string) (*Role, *validator.Validator)

	AddUser(role *Role, user *User) *validator.Validator
	RemoveUser(role *Role, user *User) *validator.Validator
}

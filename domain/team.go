package domain

import (
	"time"

	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
)

var (
	// TeamName name
	TeamName = "Team"
	// TeamsName name
	TeamsName = "Teams"

	// KafkaTeamCreated topic key
	KafkaTeamCreated = "TeamCreated"

	// KafkaTeamUpdated topic key
	KafkaTeamUpdated = "TeamUpdated"

	// KafkaTeamRemoved topic key
	KafkaTeamRemoved = "TeamRemoved"

	// TeamNullUUID null key
	TeamNullUUID = "00000000-0000-0000-0000-000000000000"
)

// Team model structure
type Team struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	AccountID string    `json:"accountId" gorm:"column:account_id"`
	DomainID  string    `json:"domainId" gorm:"column:domain_id"`
	Name      string    `json:"name" gorm:"column:name" validate:"required" validate:"required"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:created_at"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"column:updated_at"`

	IsDefault bool `json:"isDefault" gorm:"-"`

	Users   []*User  `json:"users" gorm:"many2many:account.users_teams"`
	Account *Account `json:"account"`
	Domain  *Domain  `json:"domain"`
}

// TableName set domain with schema
func (Team) TableName() string {
	return "account.teams"
}

// TeamUseCase usecase interface
type TeamUseCase interface {
	TeamCreate(account *Account, team *Team) (*Team, error)
	TeamList(account *Account) ([]Team, error)
	TeamRemove(account *Account, team *Team) (*Team, error)
	TeamGet(account *Account, team *Team) (*Team, error)
	TeamUpdate(account *Account, team *Team) (*Team, error)
	TeamChange(account *Account, team *Team, user *User) (*Team, error)
}

// TeamRepository repository interface
type TeamRepository interface {
	Create(team *Team) *validator.Validator
	Remove(team *Team) *validator.Validator
	Update(team *Team) *validator.Validator

	GetByID(id string) (*Team, *validator.Validator)
	GetAllByAccountID(accountID string) ([]*Team, *validator.Validator)
	GetByAccountID(id, accountID string) (*Team, *validator.Validator)

	AddUser(team *Team, user *User) *validator.Validator
	RemoveUser(team *Team, user *User) *validator.Validator
	RemoveUsers(team *Team, users *[]User) *validator.Validator
	GetAllUsers(team *Team, users *[]User) *validator.Validator

	AddDomain(team *Team, d *Domain) *validator.Validator
	RemoveDomain(team *Team, d *Domain) *validator.Validator
	RemoveDomains(team *Team, d *[]Domain) *validator.Validator
	GetAllDomains(team *Team, d *[]Domain) *validator.Validator
}

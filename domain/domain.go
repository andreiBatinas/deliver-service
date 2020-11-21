package domain

import (
	"time"

	"github.com/andreiBatinas/deliver-service/infrastructure/validator"
)

var (
	// DomainName name
	DomainName = "Domain"
	// DomainsName name
	DomainsName = "Domains"

	// KafkaDomainCreated topic key
	KafkaDomainCreated = "DomainCreated"

	// KafkaDomainUpdated topic key
	KafkaDomainUpdated = "DomainUpdated"

	// KafkaDomainRemoved topic key
	KafkaDomainRemoved = "DomainRemoved"
)

// Domain model structure
type Domain struct {
	ID        string     `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	Name      string     `json:"name" gorm:"column:name" validate:"required,fqdn"`
	CreatedAt time.Time  `json:"createdAt" gorm:"column:created_at"`
	UpdatedAt time.Time  `json:"updatedAt" gorm:"column:updated_at"`
	IsLive    bool       `json:"isLive" gorm:"column:is_live"`
	Accounts  []*Account `json:"accounts" gorm:"many2many:account.accounts_domains"`
	Teams     []*Team    `json:"teams"`
}

// TableName set domain with schema
func (Domain) TableName() string {
	return "account.domains"
}

// DomainUseCase  usecase interface
type DomainUseCase interface {
	DomainGet(in *Domain) (*Domain, error)
	DomainList(in *Domain) ([]*Domain, error)
	DomainCreate(a *Account, d *Domain) (*Domain, error)
	DomainUpdate(a *Account, d *Domain) (*Domain, error)
	DomainRemove(a *Account, d *Domain) (*Domain, error)
}

// DomainRepository repository interface
type DomainRepository interface {
	Create(d *Domain) *validator.Validator
	Remove(d *Domain) *validator.Validator
	Update(d *Domain) *validator.Validator
	GetByID(id string, accountID string) (*Domain, *validator.Validator)
	GetByAccountID(d *Domain) ([]*Domain, *validator.Validator)
	GetByName(accountID string, domainName string) (*Domain, *validator.Validator)
	DomainsGetTeams(d *Domain) (*Domain, *validator.Validator)
}

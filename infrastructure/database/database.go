package database

import (
	"fmt"

	"github.com/andreiBatinas/deliver-service/config"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/labstack/gommon/log"
)

type dbCredentials struct {
	Driver   string
	Host     string
	Port     int
	User     string
	Password string
	Database string
	Schema   string
}

var (
	dbCfg *dbCredentials
	// DB databaseHandler
	DB *databaseHandler
)

type databaseHandler struct {
	Connection *gorm.DB
}

func connectPostgres(c dbCredentials) (*gorm.DB, error) {
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%d user=%s dbname=%s password=%s sslmode=disable", c.Host, c.Port, c.User, c.Database, c.Password))
	if err != nil {
		log.Error(err)
		return nil, err
	}

	db.Exec(fmt.Sprintf("set search_path=%s,public", c.Schema))

	return db, nil
}

// NewDatabaseConnection create new db connection handler
func NewDatabaseConnection() {

	var c dbCredentials = config.Configuration.DB
	var conn *gorm.DB
	switch c.Driver {
	case "postgres":
		conn, _ = connectPostgres(c)
		break
	default:
		log.Errorf("No database driver specified. Got %+v", c)
	}

	conn.LogMode(config.Configuration.Debug)

	DB = &databaseHandler{
		Connection: conn,
	}
}

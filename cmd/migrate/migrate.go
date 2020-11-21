package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"

	"github.com/andreiBatinas/deliver-service/config"
	"github.com/andreiBatinas/deliver-service/infrastructure/database"
)

func main() {
	directionArg := flag.String("migrate", "up", "Direction to migrate up/down")
	forceArg := flag.Int("force", 0, "Fix a migration")
	flag.Parse()

	config.Read()
	database.NewDatabaseConnection()

	driver, err := postgres.WithInstance(database.DB.Connection.DB(), &postgres.Config{
		DatabaseName:    "postgres",
		SchemaName:      config.Configuration.DB.Schema,
		MigrationsTable: "schema_migrations",
	})
	if err != nil {
		log.Fatalf("%v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"postgres", driver,
	)

	if err != nil {
		log.Fatal(err)
	}

	if *forceArg != 0 {
		fmt.Printf("---> Force version fix: %d\n", int(*forceArg))
		if err := m.Force(int(*forceArg)); err != nil {
			log.Fatal(err)
		}
		return
	}

	if "up" == *directionArg {
		fmt.Println("---> Migrate up")
		if err := m.Up(); err != nil {
			log.Fatal(err)
		}
		return
	}

	if "down" == *directionArg {
		fmt.Println("---> Migrate down")
		if err := m.Down(); err != nil {
			log.Fatal(err)
		}
		return
	}

	fmt.Printf("Choose what to do")
}

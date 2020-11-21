package config

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/spf13/viper"
)

type config struct {
	Name   string
	Debug  bool
	Server struct {
		Address string
		Port    string
	}
	DB struct {
		Driver   string
		Host     string
		Port     int
		User     string
		Password string
		Database string
		Schema   string
	}
	GRPC struct {
		Port string
	}
	Kafka struct {
		Group      string
		BrokerList []string `json:"brokerList"`
		Version    string
		Secured    bool
		Conusmer   struct {
			Offset int64
		}
		Topic struct {
			Account struct {
				Name   string
				Region string
			}
			Domain struct {
				Name   string
				Region string
			}
			Team struct {
				Name   string
				Region string
			}
			User struct {
				Name   string
				Region string
			}
		}
	}
}

var (
	// Configuration instance
	Configuration config
	configPath    string
)

// Read config file
func Read() {

	viper.SetConfigFile(`config.json`)
	viper.AutomaticEnv()

	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}

	if err := viper.Unmarshal(&Configuration); err != nil {
		panic(err)
	}

	if viper.GetBool("debug") {
		log.Println("Service RUN on DEBUG mode")

		prettyJSON, err := json.Marshal(Configuration)
		if err != nil {
			log.Fatal("Failed to generate json", err)
		}

		fmt.Printf("%s\n", string(prettyJSON))
	}
}

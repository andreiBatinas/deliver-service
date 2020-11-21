package kafka

import (
	"fmt"
	"log"
	"os"

	_appConfig "github.com/andreiBatinas/deliver-service/config"
	"github.com/Shopify/sarama"
	"github.com/google/uuid"
)

func init() {
	sarama.Logger = log.New(os.Stdout, "", log.Ltime)
}

// NewKafkaConfig create new kafka connection
func NewKafkaConfig() *sarama.Config {
	kafkaConfig := _appConfig.Configuration.Kafka

	version, err := sarama.ParseKafkaVersion(kafkaConfig.Version)
	if err != nil {
		log.Panicf("Error parsing Kafka version: %v", err)
	}

	id := uuid.New()
	clientID := fmt.Sprintf("%s-%s", _appConfig.Configuration.Name, id.String())

	config := sarama.NewConfig()
	config.Net.TLS.Enable = kafkaConfig.Secured
	config.ClientID = clientID

	// Producer Config
	config.Producer.Return.Successes = true
	config.Producer.Return.Errors = true
	config.Producer.Retry.Max = 5

	// Consumer Config
	config.Version = version
	config.Consumer.Offsets.Initial = sarama.OffsetOldest
	config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRange

	return config
}

package kafka

import (
	"log"

	_appConfig "github.com/andreiBatinas/deliver-service/config"
	"github.com/Shopify/sarama"
)

// Producer kafka producer
type Producer struct {
	// Producer sarama.AsyncProducer instance
	Producer sarama.AsyncProducer
}

// Send send message
func (kp *Producer) Send(topic, key string, message []byte) {
	m := &sarama.ProducerMessage{
		Topic: topic,
		Key:   sarama.StringEncoder(key),
		Value: sarama.ByteEncoder(message),
	}
	kp.Producer.Input() <- m
}

// Monitor producer messages
// THIS IS A GOROUTINE
func (kp *Producer) monitor() {
	for {
		select {
		case result := <-kp.Producer.Successes():
			log.Printf("> [Kafka][Producer] Message: \"%s\" \n>Partition  %d \n>Offset %d\n", result.Value, result.Partition, result.Offset)
		case err := <-kp.Producer.Errors():
			log.Println("[Kafka][Producer] Failed to produce message", err)
		}
	}
}

// NewKafkaProducer build new kafka producer
func NewKafkaProducer() *Producer {

	config := NewKafkaConfig()

	producer, err := sarama.NewAsyncProducer(_appConfig.Configuration.Kafka.BrokerList, config)
	if err != nil {
		log.Fatalf("ERR %s", err)
	}

	kp := &Producer{
		Producer: producer,
	}

	go kp.monitor()

	return kp
}

package kafka

import (
	"context"
	"log"
	"sync"

	_appConfig "github.com/andreiBatinas/deliver-service/config"
	"github.com/Shopify/sarama"
)

// ConsumerClient kafka consumer bootstrap
type ConsumerClient struct {
	ctx           context.Context
	cancel        context.CancelFunc
	config        *sarama.Config
	brokerList    []string
	consumerGroup string
	service       ConsumerInterface
}

// Setup subscribe to a topic list
func (kc *ConsumerClient) Setup() {
	consumer := &Consumer{
		ready:   make(chan bool),
		service: kc.service,
	}

	client, err := sarama.NewConsumerGroup(kc.brokerList, kc.consumerGroup, kc.config)
	if err != nil {
		log.Panicf("Error creating consumer group client: %v", err)
	}
	wg := &sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			if err := client.Consume(kc.ctx, kc.service.Topics(), consumer); err != nil {
				log.Panicf("Error from consumer: %v", err)
			}

			// check if context was cancelled, signaling that the consumer should stop
			if kc.ctx.Err() != nil {
				return
			}

			consumer.ready = make(chan bool)
		}
	}()

	// Wait for consumer ready
	<-consumer.ready
	log.Printf("Kafka [%s] consummer ready !...", kc.config.ClientID)

	select {
	case <-kc.ctx.Done():
		log.Println("terminating: context cancelled")
	}
	kc.cancel()
	wg.Wait()
	if err = client.Close(); err != nil {
		log.Panicf("Error closing client: %v", err)
	}
}

// Consumer kafka consumer
type Consumer struct {
	ready   chan bool
	service ConsumerInterface
}

// Setup kafka consumer
func (c *Consumer) Setup(sarama.ConsumerGroupSession) error {
	// Mark the consumer as ready
	close(c.ready)
	return nil
}

// Cleanup consumer
func (c *Consumer) Cleanup(sarama.ConsumerGroupSession) error {
	return nil
}

// ConsumeClaim read topic contents
func (c *Consumer) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {

	for message := range claim.Messages() {
		c.service.Message(message.Value)
		log.Printf("Message claimed: value = %s, timestamp = %v, topic = %s", string(message.Value), message.Timestamp, message.Topic)
		session.MarkMessage(message, "")
	}

	return nil
}

// NewConsumerClient build new kafka consumer client group
func NewConsumerClient(service ConsumerInterface) {
	kafkaConfig := _appConfig.Configuration.Kafka
	config := NewKafkaConfig()

	ctx, cancel := context.WithCancel(context.Background())

	kafkaConsumerClient := &ConsumerClient{
		ctx:           ctx,
		cancel:        cancel,
		config:        config,
		brokerList:    kafkaConfig.BrokerList,
		consumerGroup: kafkaConfig.Group,
		service:       service,
	}
	kafkaConsumerClient.Setup()

}

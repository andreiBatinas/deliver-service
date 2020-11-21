package kafka

// ConsumerInterface to map consumer messages
type ConsumerInterface interface {
	Topics() []string
	Message(msg []byte)
}

package kafka

import "fmt"

// Topic structure
type Topic struct {
	Name   string
	Region string
}

// MakeTopics generate proper topic name with region
func MakeTopics(topics []Topic) []string {
	stringTopics := []string{}
	for _, topic := range topics {
		t := MakeTopic(topic)
		stringTopics = append(stringTopics, t)
	}

	return stringTopics
}

// MakeTopic generate topic name
func MakeTopic(topic Topic) string {
	var t string
	if "*" == topic.Region || "" == topic.Region {
		t = topic.Name
	} else {
		t = fmt.Sprintf("%s.%s", topic.Region, topic.Name)
	}
	return t
}

package main

import (
	_userGrpc "github.com/andreiBatinas/deliver-service/account/grpc"
	"github.com/andreiBatinas/deliver-service/config"
	"github.com/andreiBatinas/deliver-service/infrastructure/database"
	"github.com/andreiBatinas/deliver-service/infrastructure/grpc"
)

func main() {
	config.Read()
	database.NewDatabaseConnection()

	//producer := kafka.NewKafkaProducer()
	//defer producer.Producer.AsyncClose()

	grpc := grpc.NewGrpcServer()
	_userGrpc.NewUserHandler(grpc)

	grpc.Start()
}

package main

import (
	"context"
	"log"
	"time"

	pb "github.com/andreiBatinas/deliver-service/protogen/proto"
	"google.golang.org/grpc"
)

const (
	addressAccount = "localhost:25002"
)

func main() {
	conn, err := grpc.Dial(addressAccount, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Unable to connect: %v", err)
	}
	defer conn.Close()

	c := pb.NewAccountServiceClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*100)
	defer cancel()

	msg := &pb.AccountRegisterRequest{
		Account: &pb.Account{
			Name:              "API local14 Awesome company",
			AddressFirstLine:  "API local14 address first line 70",
			AddressSecondLine: "API local14 optional second line 70",
			City:              "Barcelona",
			Country:           "Spain",
			PostalCode:        "010107",
		},
		User: &pb.User{
			Email:    "admin-local14@whisbi.com",
			Password: "q1w2e3r4t5@",
			Name:     "Admin local14",
			Surname:  "SAdmin local14",
			Phone:    "012345678911217",
		},
	}
	// msg := &pb.AccountRemoveRequest{
	// 	Id: "1db3412-9a8b-49ad-93e0-1b7d28b695ab",
	// 	Auth: &pb.Auth{
	// 		AccountId: "65379390-1c66-4680-bb92-ebc19f6856bd",
	// 		UserId:    "e465550e-08b8-4094-80d1-50b2de04e28f",
	// 		Role:      "accountOwner",
	// 		TeamId:    "65503dc0-9ecc-4da0-aeb0-d9d3be083b70",
	// 	},
	// }

	r, err := c.AccountRegister(ctx, msg)
	// msg := &pb.AccountRemoveRequest{
	// 	Id: "e49f5e1d-ad74-49b5-84b7-7c1fa9ebb04a",
	// }
	//	r, err := c.AccountRemove(ctx, msg)
	if err != nil {
		log.Fatalf("Could not get domain: %v", err)
	}
	log.Printf("Account server response: %t, \nERR %+v \nData %+v", r.GetStatus(), r.GetError())
}

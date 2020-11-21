package main

import (
	"context"
	"log"
	"time"

	pb "github.com/andreiBatinas/deliver-service/protogen/proto"
	"google.golang.org/grpc"
)

const (
	addressTeam = "localhost:25002"
)

func main() {
	conn, err := grpc.Dial(addressTeam, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Unable to connect: %v", err)
	}
	defer conn.Close()

	c := pb.NewUserServiceClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	msg := &pb.UserChangePasswordRequest{
		Auth: &pb.Auth{
			AccountId: "65379390-1c66-4680-bb92-ebc19f6856bd",
			UserId:    "e465550e-08b8-4094-80d1-50b2de04e28f",
			Role:      "accountOwner",
			TeamId:    "65503dc0-9ecc-4da0-aeb0-d9d3be083b70",
		},
		UserChangePassword: &pb.UserChangePassword{
			OldPassword: "abc123@?",
			NewPassword: "1234567",
		},
	}

	r, err := c.UserChangePassword(ctx, msg)
	if err != nil {
		log.Fatalf("Team err: %v", err)
	}
	log.Printf("Account server response: %t, %+v", r.GetStatus(), r.GetError())

}

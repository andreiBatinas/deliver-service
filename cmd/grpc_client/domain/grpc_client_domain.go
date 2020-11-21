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

	c := pb.NewDomainServiceClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*100)
	defer cancel()

	msg := &pb.DomainRequest{
		Domain: &pb.Domain{
			Id: "d51a80fa-d350-44c1-a426-9d9796d24eed",
		},
		Auth: &pb.Auth{
			AccountId: "542c0097-817f-46d9-b683-7aaeb1898d1a",
			UserId:    "cebb638d-5b95-4e1e-8122-74885d33dee3",
			Role:      "accountOwner",
			TeamId:    "65503dc0-9ecc-4da0-aeb0-d9d3be083b70",
		},
	}

	r, err := c.DomainList(ctx, msg)
	if err != nil {
		log.Fatalf("Could not get domain: %v", err)
	}
	log.Printf("Account server response: %t, \nERR %+v \nData %+v", r.GetStatus(), r.GetData())
}

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

	c := pb.NewTeamServiceClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	msg := &pb.TeamRequest{
		Team: &pb.Team{
			Id: "42eae0a6-ce57-436f-8cc2-ed58259f3e67",
		},
		Auth: &pb.Auth{
			AccountId: "fcb03b14-9f98-41ba-90fe-951e7ef11fb1",
			UserId:    "9ae52146-8e24-4d8f-94e2-686fa2b33da7",
		},
	}

	r, err := c.TeamChange(ctx, msg)
	if err != nil {
		log.Fatalf("Team err: %v", err)
	}
	log.Printf("Account server response: %t, %+v", r.GetStatus(), r.GetError())

}

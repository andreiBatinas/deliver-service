package grpc

import (
	"log"
	"net"

	"github.com/andreiBatinas/deliver-service/config"
	"google.golang.org/grpc"
)

// Server server struct
type Server struct {
	RPC *grpc.Server
	TCP net.Listener
}

// Start grpc server
func (s *Server) Start() {
	log.Printf("Starting GRPC server. Port: %s", config.Configuration.GRPC.Port)
	if err := s.RPC.Serve(s.TCP); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

// NewGrpcServer grpc server
func NewGrpcServer() *Server {
	lis, err := net.Listen("tcp", ":"+config.Configuration.GRPC.Port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	return &Server{
		TCP: lis,
		RPC: s,
	}
}

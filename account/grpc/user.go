package grpc

import (
	"context"
	"log"
	"sort"

	"github.com/andreiBatinas/deliver-service/account/repository"
	"github.com/andreiBatinas/deliver-service/account/usecase"
	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/grpc"
	pb "github.com/andreiBatinas/deliver-service/protogen/proto"
)

type serviceUser struct {
	pb.UnimplementedUserServiceServer
	UserUseCase domain.UserUseCase
}

func (s *serviceUser) UserGet(ctx context.Context, in *pb.UserRequest) (*pb.UserResponse, error) {

	d := &domain.User{
		ID: in.GetUser().GetId(),
	}

	u, err := s.UserUseCase.UserGet(d)
	if err != nil {
		log.Printf("[GRPC][UserGet][DataValidation] %+v Got: %+v", err.Error(), u)

		return &pb.UserResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	userResponseData := &pb.UserResponse_Data{
		User: &pb.User{
			Id:    u.ID,
			Name:  u.Name,
			Email: u.Email,
			Role: &pb.Role{
				Id:    u.Roles[0].ID,
				Name:  u.Roles[0].Name,
				Level: int32(u.Roles[0].Level),
			},
		},
	}

	return &pb.UserResponse{Status: true, Data: userResponseData}, nil

}

func (s *serviceUser) UserRegister(ctx context.Context, in *pb.UserRequest) (*pb.UserRegisterResponse, error) {

	u := &domain.User{
		Email:    in.GetUser().GetEmail(),
		Password: in.GetUser().GetPassword(),
		Name:     in.GetUser().GetName(),
		Phone:    in.GetUser().GetPhone(),
	}

	r, err := s.UserUseCase.UserRegister(u)
	if err != nil {
		log.Printf("[GRPC][UserCreate][DataValidation] %+v Got: %+v", err.Error(), r)

		return &pb.UserRegisterResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	userResponseData := &pb.UserRegisterResponse_Data{
		User: &pb.User{
			Id:    r.ID,
			Name:  r.Name,
			Email: r.Email,
			Phone: r.Phone,
			Role: &pb.Role{
				Id:   r.Roles[0].ID,
				Name: r.Roles[0].Name,
			},
		},
	}

	return &pb.UserRegisterResponse{
		Status: true,
		Data: &pb.UserRegisterResponse_Data{
			User: userResponseData.User,
		},
	}, nil
}

func (s *serviceUser) UserRemove(ctx context.Context, in *pb.UserRequest) (*pb.UserResponse, error) {
	u := &domain.User{
		ID: in.GetUser().GetId(),
	}

	r, err := s.UserUseCase.UserRemove(u)
	if err != nil {
		log.Printf("[GRPC][UserRemove][DataValidation] %+v Got: %+v", err.Error(), r)

		return &pb.UserResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	userResponseData := &pb.UserResponse_Data{
		User: &pb.User{
			Id:    r.ID,
			Name:  r.Name,
			Email: r.Email,
			Phone: r.Phone,
		},
	}

	return &pb.UserResponse{
		Status: true,
		Data: &pb.UserResponse_Data{
			User: userResponseData.User,
		},
	}, nil

}

func (s *serviceUser) UserUpdate(ctx context.Context, in *pb.UserRequest) (*pb.UserResponse, error) {

	u := &domain.User{
		ID:    in.GetUser().GetId(),
		Email: in.GetUser().GetEmail(),
		Name:  in.GetUser().GetName(),
		Phone: in.GetUser().GetPhone(),
	}

	r, err := s.UserUseCase.UserUpdate(u)
	if err != nil {
		log.Printf("[GRPC][UserUpdate][DataValidation] %+v Got: %+v", err.Error(), r)

		return &pb.UserResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	userResponseData := &pb.UserResponse_Data{
		User: &pb.User{
			Id:    r.ID,
			Name:  r.Name,
			Email: r.Email,
			Phone: r.Phone,
		},
	}

	return &pb.UserResponse{
		Status: true,
		Data: &pb.UserResponse_Data{
			User: userResponseData.User,
		},
	}, nil
}

func (s *serviceUser) UserChangePassword(ctx context.Context, in *pb.UserChangePasswordRequest) (*pb.UserResponse, error) {

	accountChangePassword := &domain.UserChangePassword{
		OldPassword: in.GetUserChangePassword().GetOldPassword(),
		NewPassword: in.GetUserChangePassword().GetNewPassword(),
	}

	user := &domain.User{
		ID: in.GetAuth().GetUserId(),
	}

	a, err := s.UserUseCase.UserChangePassword(user, accountChangePassword)
	if err != nil {
		log.Printf("[GRPC][AccountChangePassword][DataValidation] %+v Got: %+v", err.Error(), a)

		return &pb.UserResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	userChangePasswordResponseData := &pb.UserResponse_Data{
		User: &pb.User{
			Id:    a.ID,
			Email: a.Email,
			Name:  a.Name,
			Role: &pb.Role{
				Id:    a.Roles[0].ID,
				Name:  a.Roles[0].Name,
				Level: int32(a.Roles[0].Level),
			},
		},
	}

	return &pb.UserResponse{Status: true, Data: userChangePasswordResponseData}, nil

}

func (s *serviceUser) UserAuthenticate(ctx context.Context, in *pb.UserAuthenticationRequest) (*pb.UserResponse, error) {

	accountAuthenticate := &domain.UserAuthenticate{
		Email:    in.GetUserAuthenticate().GetEmail(),
		Password: in.GetUserAuthenticate().GetPassword(),
	}

	a, err := s.UserUseCase.UserAuthenticate(accountAuthenticate)
	if err != nil {
		log.Printf("[GRPC][AccountAuthenticate][DataValidation] %+v Got: %+v", err.Error(), a)

		return &pb.UserResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	sort.Slice(a.Roles, func(i, j int) bool {
		return a.Roles[i].Level > a.Roles[j].Level
	})

	userResponseData := &pb.UserResponse_Data{
		User: &pb.User{
			Id:    a.ID,
			Email: a.Email,
			Name:  a.Name,
			Role: &pb.Role{
				Id:    a.Roles[0].ID,
				Name:  a.Roles[0].Name,
				Level: int32(a.Roles[0].Level),
			},
		},
	}

	return &pb.UserResponse{Status: true, Data: userResponseData}, nil

}

// NewUserHandler GRPC entry point
func NewUserHandler(server *grpc.Server) {
	srv := &serviceUser{
		UserUseCase: usecase.NewUserUseCase(
			repository.NewUserRepository(),
			repository.NewRoleRepository(),
		),
	}
	pb.RegisterUserServiceServer(server.RPC, srv)
}

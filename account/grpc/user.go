package grpc

import (
	"context"
	"log"

	"github.com/andreiBatinas/deliver-service/account/repository"
	"github.com/andreiBatinas/deliver-service/account/usecase"
	"github.com/andreiBatinas/deliver-service/domain"
	"github.com/andreiBatinas/deliver-service/infrastructure/grpc"
	pb "github.com/andreiBatinas/deliver-service/protogen/proto"
)

type serviceUser struct {
	pb.UnimplementedAccountServiceServer
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
			Id:      u.ID,
			Name:    u.Name,
			Surname: u.Surname,
			Email:   u.Email,
			Role: &pb.Role{
				Id:    u.Roles[0].ID,
				Name:  u.Roles[0].Name,
				Level: int32(u.Roles[0].Level),
			},

		},
	}

	return &pb.UserResponse{Status: true, Data: userResponseData}, nil

}

func (s *serviceUser) UserList(ctx context.Context, in *pb.UserRequest) (*pb.UserListResponse, error) {

	d := &domain.Account{
		ID: in.GetAuth().GetAccountId(),
	}

	users, err := s.UserUseCase.UserList(d)
	if err != nil {
		log.Printf("[GRPC][UserGet][DataValidation] %+v Got: %+v", err.Error(), users)

		return &pb.UserListResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	pbUserList := make([]*pb.User, 0)

	for _, user := range users {



		e := &pb.User{
			Id:      user.ID,
			Name:    user.Name,
			Surname: user.Surname,
			Email:   user.Email,
			Role: &pb.Role{
				Id:    user.Roles[0].ID,
				Name:  user.Roles[0].Name,
				Level: int32(user.Roles[0].Level),
			},

		}
		pbUserList = append(pbUserList, e)
	}

	return &pb.UserListResponse{Status: true, Data: &pb.UserListResponse_Data{
		Users: pbUserList,
	}}, nil
}

func (s *serviceUser) UserCreate(ctx context.Context, in *pb.UserRequest) (*pb.UserResponse, error) {
	a := &domain.Account{
		ID: in.GetAuth().GetAccountId(),
	}

	u := &domain.User{
		Email:    in.GetUser().GetEmail(),
		Password: in.GetUser().GetPassword(),
		Name:     in.GetUser().GetName(),
		Surname:  in.GetUser().GetSurname(),
		Phone:    in.GetUser().GetPhone(),
	}

	r, err := s.UserUseCase.UserCreate(a, u)
	if err != nil {
		log.Printf("[GRPC][UserCreate][DataValidation] %+v Got: %+v", err.Error(), r)

		return &pb.UserResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	userResponseData := &pb.UserResponse_Data{
		User: &pb.User{
			Id:      r.ID,
			Name:    r.Name,
			Surname: r.Surname,
			Email:   r.Email,
			Phone:   r.Phone,
			Role: &pb.Role{
				Id:   r.Roles[0].ID,
				Name: r.Roles[0].Name,
			},
		},
	}



	return &pb.UserResponse{
		Status: true,
		Data: &pb.UserResponse_Data{
			User: userResponseData.User,
		},
	}, nil
}

func (s *serviceUser) UserRemove(ctx context.Context, in *pb.UserRequest) (*pb.UserResponse, error) {
	a := &domain.Account{
		ID: in.GetAuth().GetAccountId(),
	}

	u := &domain.User{
		ID: in.GetUser().GetId(),
	}

	r, err := s.UserUseCase.UserRemove(a, u)
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
			Id:      r.ID,
			Name:    r.Name,
			Surname: r.Surname,
			Email:   r.Email,
			Phone:   r.Phone,
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
	a := &domain.Account{
		ID: in.GetAuth().GetAccountId(),
	}

	u := &domain.User{
		ID:      in.GetUser().GetId(),
		Email:   in.GetUser().GetEmail(),
		Name:    in.GetUser().GetName(),
		Surname: in.GetUser().GetSurname(),
		Phone:   in.GetUser().GetPhone(),
	}

	r, err := s.UserUseCase.UserUpdate(a, u)
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
			Id:      r.ID,
			Name:    r.Name,
			Surname: r.Surname,
			Email:   r.Email,
			Phone:   r.Phone,
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
			Id:      a.ID,
			Email:   a.Email,
			Name:    a.Name,
			Surname: a.Surname,
			Role: &pb.Role{
				Id:    a.Roles[0].ID,
				Name:  a.Roles[0].Name,
				Level: int32(a.Roles[0].Level),
			},
		},
	}

	return &pb.UserResponse{Status: true, Data: userChangePasswordResponseData}, nil

}

// NewUserHandler GRPC entry point
func NewUserHandler(server *grpc.Server) {
	srv := &serviceUser{
		UserUseCase: usecase.NewUserUseCase(
			repository.NewAccountRepository(),
			repository.NewUserRepository(),
			repository.NewTeamRepository(),
			repository.NewRoleRepository(),
			repository.NewUsersTeamsRepository(),
		),
	}
	pb.RegisterUserServiceServer(server.RPC, srv)
}

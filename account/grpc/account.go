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

type serviceAccount struct {
	pb.UnimplementedAccountServiceServer
	AccountUseCase domain.AccountUseCase
}

func (s *serviceAccount) AccountGet(ctx context.Context, in *pb.AccountRequest) (*pb.AccountResponse, error) {

	account := &domain.Account{
		ID: in.GetAuth().GetAccountId(),
	}

	a, err := s.AccountUseCase.AccountGet(account)
	if err != nil {
		log.Printf("[GRPC][AccountGet][DataValidation] %+v Got: %+v", err.Error(), a)

		return &pb.AccountResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	accountResponseData := &pb.AccountResponse_Data{
		Account: &pb.Account{
			Id:                a.ID,
			AddressFirstLine:  a.AddressFirstLine,
			AddressSecondLine: a.AddressSecondLine,
			City:              a.City,
			Country:           a.Country,
			Name:              a.Name,
			PostalCode:        a.PostalCode,
		},
	}

	return &pb.AccountResponse{Status: true, Data: accountResponseData}, nil
}

func (s *serviceAccount) AccountUpdate(ctx context.Context, in *pb.AccountRequest) (*pb.AccountResponse, error) {

	account := &domain.Account{
		ID:                in.GetAuth().GetAccountId(),
		Name:              in.GetAccount().GetName(),
		AddressFirstLine:  in.GetAccount().GetAddressFirstLine(),
		AddressSecondLine: in.GetAccount().GetAddressSecondLine(),
		City:              in.GetAccount().GetCity(),
		Country:           in.GetAccount().GetCountry(),
		PostalCode:        in.GetAccount().GetPostalCode(),
	}

	a, err := s.AccountUseCase.AccountUpdate(account)
	if err != nil {
		log.Printf("[GRPC][AccountUpdate][DataValidation] %+v Got: %+v", err.Error(), a)

		return &pb.AccountResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	accountResponseData := &pb.AccountResponse_Data{
		Account: &pb.Account{
			Id:                a.ID,
			AddressFirstLine:  a.AddressFirstLine,
			AddressSecondLine: a.AddressSecondLine,
			City:              a.City,
			Country:           a.Country,
			Name:              a.Name,
			PostalCode:        a.PostalCode,
		},
	}


	return &pb.AccountResponse{Status: true, Data: accountResponseData}, nil
}

func (s *serviceAccount) AccountAuthenticate(ctx context.Context, in *pb.AccountAuthenticationRequest) (*pb.AccountRegisterResponse, error) {

	accountAuthenticate := &domain.AccountAuthenticate{
		Email:    in.GetAccountAuthenticate().GetEmail(),
		Password: in.GetAccountAuthenticate().GetPassword(),
	}

	a, err := s.AccountUseCase.AccountAuthenticate(accountAuthenticate)
	if err != nil {
		log.Printf("[GRPC][AccountAuthenticate][DataValidation] %+v Got: %+v", err.Error(), a)

		return &pb.AccountRegisterResponse{
			Status: false,
			Error:  err.Error(),
			Data:   nil,
		}, nil
	}

	sort.Slice(a.Roles, func(i, j int) bool {
		return a.Roles[i].Level > a.Roles[j].Level
	})





	accountRegisterResponseData := &pb.AccountRegisterResponse_Data{
		Account: &pb.Account{
			Id:                a.Accounts[0].ID,
			AddressFirstLine:  a.Accounts[0].AddressFirstLine,
			AddressSecondLine: a.Accounts[0].AddressSecondLine,
			City:              a.Accounts[0].City,
			Country:           a.Accounts[0].Country,
			Name:              a.Accounts[0].Name,
			PostalCode:        a.Accounts[0].PostalCode,
		},
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

	return &pb.AccountRegisterResponse{Status: true, Data: accountRegisterResponseData}, nil

}

func (s *serviceAccount) AccountRegister(ctx context.Context, in *pb.AccountRegisterRequest) (*pb.AccountRegisterResponse, error) {
	accountRaw := in.GetAccount()
	userRaw := in.GetUser()



	d := &domain.Account{
		Name:              accountRaw.GetName(),
		AddressFirstLine:  accountRaw.GetAddressFirstLine(),
		AddressSecondLine: accountRaw.GetAddressSecondLine(),
		City:              accountRaw.GetCity(),
		Country:           accountRaw.GetCountry(),
		PostalCode:        accountRaw.GetPostalCode(),
		Users: []*domain.User{
			{
				Email:    userRaw.GetEmail(),
				Password: userRaw.GetPassword(),
				Name:     userRaw.GetName(),
				Surname:  userRaw.GetSurname(),
				Phone:    userRaw.GetPhone(),
			},
		},

	}

	a, err := s.AccountUseCase.AccountRegister(d)
	if err != nil {
		log.Printf("[GRPC][AccountRegister][DataValidation] %+v Got: %+v", err.Error(), accountRaw)

		return &pb.AccountRegisterResponse{
			Status: false,
			Error:  err.Error(),
			Data: &pb.AccountRegisterResponse_Data{
				Account: in.GetAccount(),
				User:    in.GetUser(),
			},
		}, nil
	}

	accountRegisterResponseData := &pb.AccountRegisterResponse_Data{
		Account: &pb.Account{
			Id:                a.ID,
			AddressFirstLine:  a.AddressFirstLine,
			AddressSecondLine: a.AddressSecondLine,
			City:              a.City,
			Country:           a.Country,
			Name:              a.Name,
			PostalCode:        a.PostalCode,
		},
		User: &pb.User{
			Id:      a.Users[0].ID,
			Email:   a.Users[0].Email,
			Name:    a.Users[0].Name,
			Surname: a.Users[0].Surname,
			Role: &pb.Role{
				Name: a.Users[0].Roles[0].Name,
			},
		},
		Auth: &pb.AccountRegisterResponse_Data_Auth{
			Token: "",
		},
	}

	return &pb.AccountRegisterResponse{Status: true, Data: accountRegisterResponseData}, nil
}

func (s *serviceAccount) AccountRemove(ctx context.Context, in *pb.AccountRemoveRequest) (*pb.AccountRemoveResponse, error) {

	d := &domain.Account{
		ID: in.GetAuth().GetAccountId(),
	}

	_, err := s.AccountUseCase.AccountRemove(d)
	if err != nil {
		return &pb.AccountRemoveResponse{Status: false, Error: err.Error()}, nil
	}


	return &pb.AccountRemoveResponse{Status: true}, nil
}

// NewAccountHandler GRPC entry point
func NewAccountHandler(server *grpc.Server) {
	srv := &serviceAccount{
		AccountUseCase: usecase.NewAccountUseCase(
			repository.NewAccountRepository(),
			repository.NewUserRepository(),
			repository.NewRoleRepository(),
			repository.NewTeamRepository(),
			repository.NewDomainRepository(),
			repository.NewUsersTeamsRepository(),
		),

	}
	pb.RegisterAccountServiceServer(server.RPC, srv)
}

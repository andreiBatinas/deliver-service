export interface AddUserDTO {
  user: {
    userName: string;
    userSurname: string;
    userPassword: string;
    userEmail: string;
    userRole: string;
    userTelephone: string;
    userCreatedAt: Date;
    userUpdatedAt: Date;
    fleetId: number;
  };
}

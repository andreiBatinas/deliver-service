export interface AddUserDTO {
  userToAdd: {
    userName: string;
    userSurname: string;
    userPassword: string;
    userEmail: string;
    userRole: string;
    userTelephone: string;
    fleetName: string;
    accountId: number;
  };
}

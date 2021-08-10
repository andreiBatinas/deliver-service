export interface UpdateUserDTO {
  user: {
    userId: number;
    userName: string;
    userSurname: string;
    userPassword: string;
    userEmail: string;
    userRole: string;
    userTelephone: string;
  };
}

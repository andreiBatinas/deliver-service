export interface CreateAccountDTO {
  account: {
    accountName: string;
    accountPassword: string;
    accountEmail: string;
    accountTelephone: string;
    accountOfficeAddress: string;
    accountCreatedAt: Date;
    accountUpdatedAt: Date;
    accountCUI: string;
  };
}

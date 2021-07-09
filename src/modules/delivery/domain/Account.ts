import { Entity, UniqueEntityId } from '../../../core/domain';
import { Result, Validator } from '../../../core/logic';

interface AccountProps {
  accountId?: number;
  accountName: string;
  accountPassword: string;
  accountEmail: string;
  accountCUI: string;
  accountOfficeAddress: string;
  accountTelephone: string;
  accountCreatedAt: string;
  accountUpdatedAt: string;
  //modules?: Module[];
}

export class Account extends Entity<AccountProps> {
  get accountId(): number {
    return this.props.accountId as number;
  }

  // get modules(): Module[] | undefined {
  //   return this.props.modules;
  // }

  get accountName(): string {
    return this.props.accountName;
  }

  get accountPassword(): string {
    return this.props.accountPassword;
  }

  get accountEmail(): string {
    return this.props.accountEmail;
  }

  get accountCUI(): string {
    return this.props.accountCUI;
  }

  get accountOfficeAddress(): string {
    return this.props.accountOfficeAddress;
  }

  get accountUpdatedAt(): string {
    return this.props.accountUpdatedAt;
  }

  get accountCreatedAt(): string {
    return this.props.accountCreatedAt;
  }

  get accountTelephone(): string {
    return this.props.accountTelephone;
  }

  constructor(props: AccountProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: AccountProps, id?: UniqueEntityId): Result<Account> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.accountCUI, argName: 'accountCUI' },
      { arg: props.accountEmail, argName: 'accountEmail' },
      { arg: props.accountName, argName: 'accountName' },
      { arg: props.accountOfficeAddress, argName: 'accountOfficeAddress' },
      { arg: props.accountPassword, argName: 'accountPassword' },
      { arg: props.accountTelephone, argName: 'accountTelephone' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<Account>(validator.message);
    }

    const account = new Account(props, id);
    return Result.OK<Account>(account);
  }
}

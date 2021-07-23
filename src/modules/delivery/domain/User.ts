import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface UserProps {
  userId?: number;
  userName: string;
  userSurname: string;
  userPassword: string;
  userEmail: string;
  userRole: string;
  userTelephone: string;
  userCreatedAt: string;
  userUpdatedAt: string;
  fleetId: number;
  //modules?: Module[];
}

export class User extends Entity<UserProps> {
  get userId(): number {
    return this.props.userId as number;
  }

  // get modules(): Module[] | undefined {
  //   return this.props.modules;
  // }

  get userName(): string {
    return this.props.userName;
  }

  get userSurname(): string {
    return this.props.userSurname;
  }

  get userPassword(): string {
    return this.props.userPassword;
  }

  get userEmail(): string {
    return this.props.userEmail;
  }

  get userRole(): string {
    return this.props.userRole;
  }

  get userUpdatedAt(): string {
    return this.props.userUpdatedAt;
  }

  get userCreatedAt(): string {
    return this.props.userCreatedAt;
  }

  get fleetId(): number {
    return this.props.fleetId;
  }

  get userTelephone(): string {
    return this.props.userTelephone;
  }

  constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: UserProps, id?: UniqueEntityId): Result<User> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.userSurname, argName: 'userSurname' },
      { arg: props.userEmail, argName: 'userEmail' },
      { arg: props.userName, argName: 'userName' },
      { arg: props.userRole, argName: 'userRole' },
      { arg: props.userPassword, argName: 'userPassword' },
      { arg: props.userTelephone, argName: 'userTelephone' },
      { arg: props.fleetId, argName: 'fleetId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<User>(validator.message);
    }

    const user = new User(props, id);
    return Result.OK<User>(user);
  }
}

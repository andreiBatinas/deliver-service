import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface UserIdProps {
  userId?: number;
}

export class UserId extends Entity<UserIdProps> {
  get userId(): number {
    return this.props.userId as number;
  }

  constructor(props: UserIdProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: UserIdProps, id?: UniqueEntityId): Result<UserId> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.userId, argName: 'userId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<UserId>(validator.message);
    }

    const user = new UserId(props, id);
    return Result.OK<UserId>(user);
  }
}

import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface AccountIdProps {
  accountId?: number;
}

export class AccountId extends Entity<AccountIdProps> {
  get accountId(): number {
    return this.props.accountId as number;
  }

  constructor(props: AccountIdProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: AccountIdProps, id?: UniqueEntityId): Result<AccountId> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.accountId, argName: 'accountId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<AccountId>(validator.message);
    }

    const account = new AccountId(props, id);
    return Result.OK<AccountId>(account);
  }
}

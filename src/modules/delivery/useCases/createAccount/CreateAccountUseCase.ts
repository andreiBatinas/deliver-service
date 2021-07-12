import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { Account } from '../../domain/Account';
import { AccountMap } from '../../mappers/AccountMap';
import { IAccountRepo } from '../../repos/AccountRepo';
import { CreateAccountDTO } from './CreateAccountDTO';
import { CreateAccountErrors } from './CreateAccountErrors';
import { CreateAccountResponse } from './CreateAccountResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class CreateAccountUseCase
  implements UseCase<CreateAccountDTO, Response>
{
  private accountRepo: IAccountRepo;

  constructor(accountRepo: IAccountRepo) {
    this.accountRepo = accountRepo;
  }

  public async execute(req: CreateAccountDTO): Promise<Response> {
    const log = new Logger('CreateAccountUseCase');

    const c = AccountMap.toBackend(req.account);
    const accountOrError = Account.New(c);

    if (accountOrError.isFailure) {
      return wrong(Result.Fail<Account>(accountOrError.error)) as Response;
    }

    try {
      const account = accountOrError.getValue() as Account;
      const exist = await this.accountRepo.exists(account.accountEmail);

      if (exist) {
        return wrong(
          new CreateAccountErrors.AccountExists(account.accountEmail),
        ) as Response;
      }
      const r = await this.accountRepo.save(account);

      const result: CreateAccountResponse = {
        result: 'account created',
        data: AccountMap.toFrontend(r),
      };

      return right(Result.OK<CreateAccountResponse>(result)) as Response;
    } catch (e) {
      return wrong(new CreateAccountErrors.UnknownError(e)) as Response;
    }
  }
}

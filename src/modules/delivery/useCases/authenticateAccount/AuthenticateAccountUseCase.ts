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
import { AuthenticateAccountDTO } from './AuthenticateAccountDTO';
import { AuthenticateAccountErrors } from './AuthenticateAccountErrors';
import { AuthenticateAccountResponse } from './AuthenticateAccountResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class AuthenticateAccountUseCase
  implements UseCase<AuthenticateAccountDTO, Response>
{
  private accountRepo: IAccountRepo;

  constructor(accountRepo: IAccountRepo) {
    this.accountRepo = accountRepo;
  }

  public async execute(req: AuthenticateAccountDTO): Promise<Response> {
    const log = new Logger('AuthenticateAccountUseCase');

    const a = AccountMap.toBackend(req.accountAuth);
    const accountOrError = Account.NewAuth(a);

    if (accountOrError.isFailure) {
      return wrong(Result.Fail<Account>(accountOrError.error)) as Response;
    }

    try {
      const account = accountOrError.getValue() as Account;

      const exist = await this.accountRepo.existsAuth(
        account.accountEmail,
        account.accountPassword,
      );

      if (!exist) {
        return wrong(
          new AuthenticateAccountErrors.DataNotFound(account.accountEmail),
        ) as Response;
      }
      const result: AuthenticateAccountResponse = {
        result: 'authentification succesfull',
        data: AccountMap.toFrontend(account),
      };

      return right(Result.OK<AuthenticateAccountResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new AuthenticateAccountErrors.UnknownError(e)) as Response;
    }
  }
}

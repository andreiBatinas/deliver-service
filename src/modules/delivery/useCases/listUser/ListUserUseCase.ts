import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { AccountId } from '../../domain/AccountId';
import { FleetId } from '../../domain/FleetId';
import { User } from '../../domain/User';
import { AccountIdMap } from '../../mappers/AccountIdMap';
import { UserMap } from '../../mappers/UserMap';
import { IUserRepo } from '../../repos/UserRepo';
import { ListUserDTO } from './ListUserDTO';
import { ListUserErrors } from './ListUserErrors';
import { ListUserResponse } from './ListUserResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class ListUserUseCase implements UseCase<ListUserDTO, Response> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(req: ListUserDTO): Promise<Response> {
    const log = new Logger('ListUserUseCase');

    const a = AccountIdMap.toBackend(req.userToList);
    const accountIdOrError = AccountId.New(a);

    if (accountIdOrError.isFailure) {
      return wrong(Result.Fail<FleetId>(accountIdOrError.error)) as Response;
    }

    // const f = FleetIdMap.toBackend(req.userToList);
    // const fleetIdOrError = FleetId.New(f);

    // if (fleetIdOrError.isFailure) {
    //   return wrong(Result.Fail<FleetId>(fleetIdOrError.error)) as Response;
    // }

    try {
      const account = accountIdOrError.getValue() as AccountId;
      //const fleet = fleetIdOrError.getValue() as FleetId;
      const listUser = (await this.userRepo.findUsersByAccountId(
        account.accountId,
      )) as User[];

      if (listUser === null) {
        return wrong(
          new ListUserErrors.UnknownError(`${account.accountId}`),
        ) as Response;
      }

      const resultList = listUser.map((entry: any) => {
        return UserMap.toFrontend(entry);
      });

      const result: ListUserResponse = {
        result: 'user list',
        data: resultList,
      };

      return right(Result.OK<ListUserResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new ListUserErrors.UnknownError(e)) as Response;
    }
  }
}

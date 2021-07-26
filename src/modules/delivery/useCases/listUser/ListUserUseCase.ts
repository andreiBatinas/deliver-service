import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { FleetId } from '../../domain/FleetId';
import { User } from '../../domain/User';
import { FleetIdMap } from '../../mappers/FleetIdMap';
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

    const f = FleetIdMap.toBackend(req.user);
    const fleetIdOrError = FleetId.New(f);

    if (fleetIdOrError.isFailure) {
      return wrong(Result.Fail<FleetId>(fleetIdOrError.error)) as Response;
    }

    try {
      const fleet = fleetIdOrError.getValue() as FleetId;
      const listUser = (await this.userRepo.findUsersByFleetId(
        fleet.fleetId,
      )) as User[];

      if (listUser === null) {
        return wrong(
          new ListUserErrors.UnknownError(`${fleet.fleetId}`),
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
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new ListUserErrors.UnknownError(e)) as Response;
    }
  }
}

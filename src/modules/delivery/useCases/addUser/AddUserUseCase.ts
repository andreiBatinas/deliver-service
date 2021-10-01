import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { User } from '../../domain/User';
import { UserMap } from '../../mappers/UserMap';
import { IFleetRepo } from '../../repos/FleetRepo';
import { IUserRepo } from '../../repos/UserRepo';
import { AddUserDTO } from './AddUserDTO';
import { AddUserErrors } from './AddUserErrors';
import { AddUserResponse } from './AddUserResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class AddUserUseCase implements UseCase<AddUserDTO, Response> {
  private userRepo: IUserRepo;
  private fleetRepo: IFleetRepo;

  constructor(userRepo: IUserRepo, fleetRepo: IFleetRepo) {
    this.userRepo = userRepo;
    this.fleetRepo = fleetRepo;
  }

  public async execute(req: AddUserDTO): Promise<Response> {
    const log = new Logger('AddUserUseCase');

    const fleetCheck = await this.fleetRepo.findFleetByFleetName(
      req.userToAdd.fleetName,
    );
    if (fleetCheck === null) {
      return wrong(
        new AddUserErrors.FleetDoesntExists(req.userToAdd.fleetName),
      ) as Response;
    }
    const userToAdd: any = req.userToAdd;
    userToAdd.fleetId = fleetCheck.fleetId;

    const u = UserMap.toBackend(userToAdd);
    const userOrError = User.New(u);

    if (userOrError.isFailure) {
      return wrong(Result.Fail<User>(userOrError.error)) as Response;
    }

    try {
      const user = userOrError.getValue() as User;
      const exist = await this.userRepo.exists(user.userEmail);

      if (exist) {
        return wrong(new AddUserErrors.UserExists(user.userEmail)) as Response;
      }

      const r = await this.userRepo.save(user);

      const result: AddUserResponse = {
        result: 'user added',
        data: UserMap.toFrontend(r),
      };

      return right(Result.OK<AddUserResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new AddUserErrors.UnknownError(e)) as Response;
    }
  }
}

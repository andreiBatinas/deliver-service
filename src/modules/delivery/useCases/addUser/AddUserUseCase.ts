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
import { IUserRepo } from '../../repos/UserRepo';
import { AddUserDTO } from './AddUserDTO';
import { AddUserErrors } from './AddUserErrors';
import { AddUserResponse } from './AddUserResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class AddFleetUseCase implements UseCase<AddUserDTO, Response> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(req: AddUserDTO): Promise<Response> {
    const log = new Logger('AddFleetUseCase');

    const u = UserMap.toBackend(req.user);
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

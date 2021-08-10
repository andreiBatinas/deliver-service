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
import { UserId } from '../../domain/UserId';
import { UserIdMap } from '../../mappers/UserIdMap';
import { UserMap } from '../../mappers/UserMap';
import { IUserRepo } from '../../repos/UserRepo';
import { GetUserDTO } from './GetUserDTO';
import { GetUserErrors } from './GetUserErrors';
import { GetUserResponse } from './GetUserResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class GetUserUseCase implements UseCase<GetUserDTO, Response> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(req: GetUserDTO): Promise<Response> {
    const log = new Logger('GetUserUseCase');

    const u = UserIdMap.toBackend(req.user);
    const userOrError = UserId.New(u);

    if (userOrError.isFailure) {
      return wrong(Result.Fail<UserId>(userOrError.error)) as Response;
    }

    try {
      const user = userOrError.getValue() as UserId;
      const persistantUser = (await this.userRepo.findUserByUserId(
        user.userId,
      )) as User;

      if (persistantUser === null) {
        return wrong(
          new GetUserErrors.UnknownError(`${user.userId}`),
        ) as Response;
      }

      const result: GetUserResponse = {
        result: 'user found',
        data: UserMap.toFrontend(persistantUser),
      };

      return right(Result.OK<GetUserResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new GetUserErrors.UnknownError(e)) as Response;
    }
  }
}

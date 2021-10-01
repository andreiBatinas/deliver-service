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
import { UserMap } from '../../mappers/UserMap';
import { IUserRepo } from '../../repos/UserRepo';
import { UpdateUserDTO } from './UpdateUserDTO';
import { UpdateUserErrors } from './UpdateUserErrors';
import { UpdateUserResponse } from './UpdateUserResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class UpdateUserUseCase implements UseCase<UpdateUserDTO, Response> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  public async execute(req: UpdateUserDTO): Promise<Response> {
    const log = new Logger('UpdateUserUseCase');

    const u = UserMap.toBackend(req.user);
    const userIdOrError = UserId.New(u);

    if (userIdOrError.isFailure) {
      return wrong(Result.Fail<User>(userIdOrError.error)) as Response;
    }
    try {
      const user = u as User;
      const checkUser = (await this.userRepo.findUserByUserId(
        user.userId,
      )) as User;

      if (checkUser === null) {
        return wrong(
          new UpdateUserErrors.UserDoesntExists(`${user.userId}`),
        ) as Response;
      }

      const r = await this.userRepo.updateUser(user);

      if (r === null) {
        return wrong(
          new UpdateUserErrors.UnknownError(`${user.userId}`),
        ) as Response;
      }

      const result: UpdateUserResponse = {
        result: 'user updated',
        data: UserMap.toFrontend(r),
      };

      return right(Result.OK<UpdateUserResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new UpdateUserErrors.UnknownError(e)) as Response;
    }
  }
}

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
import { IUserRepo } from '../../repos/UserRepo';
import { RemoveUserDTO } from './RemoveUserDTO';
import { RemoveUserErrors } from './RemoveUserErrors';
import { RemoveUserResponse } from './RemoveUserResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class RemoveUserUseCase implements UseCase<RemoveUserDTO, Response> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(req: RemoveUserDTO): Promise<Response> {
    const log = new Logger('RemoveUserUseCase');

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
          new RemoveUserErrors.UnknownError(`${user.userId}`),
        ) as Response;
      }

      const r = await this.userRepo.removeUserByUserId(persistantUser.userId);

      const result: RemoveUserResponse = {
        result: 'user remove',
        data: UserIdMap.toFrontend(r),
      };

      return right(Result.OK<RemoveUserResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new RemoveUserErrors.UnknownError(e)) as Response;
    }
  }
}

import { HttpController } from '../../../../core/infrastructure';
import { UpdateUserDTO } from './UpdateUserDTO';
import { UpdateUserErrors } from './UpdateUserErrors';
import { UpdateUserUseCase } from './UpdateUserUseCase';

export class UpdateUserController extends HttpController {
  private useCase: UpdateUserUseCase;

  constructor(useCase: UpdateUserUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as UpdateUserDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case UpdateUserErrors.UserDoesntExists:
        return this.badRequest(err.errorValue());
      case UpdateUserErrors.TokenNotFound:
        return this.badRequest(err.errorValue());
      default:
        return this.serviceFail(
          this.res,
          {
            error: result.value.errorValue().message,
          },
          400,
        );
    }
  }
}

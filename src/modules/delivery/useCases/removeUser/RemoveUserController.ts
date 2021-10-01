import { HttpController } from '../../../../core/infrastructure';
import { RemoveUserDTO } from './RemoveUserDTO';
import { RemoveUserErrors } from './RemoveUserErrors';
import { RemoveUserUseCase } from './RemoveUserUseCase';

export class RemoveUserController extends HttpController {
  private useCase: RemoveUserUseCase;

  constructor(useCase: RemoveUserUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as RemoveUserDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case RemoveUserErrors.TokenNotFound:
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

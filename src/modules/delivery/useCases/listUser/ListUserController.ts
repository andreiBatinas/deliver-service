import { HttpController } from '../../../../core/infrastructure';
import { ListUserDTO } from './ListUserDTO';
import { ListUserErrors } from './ListUserErrors';
import { ListUserUseCase } from './ListUserUseCase';

export class ListUserController extends HttpController {
  private useCase: ListUserUseCase;

  constructor(useCase: ListUserUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as ListUserDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case ListUserErrors.TokenNotFound:
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

import { HttpController } from '../../../../core/infrastructure';
import { AddUserDTO } from './AddUserDTO';
import { AddUserErrors } from './AddUserErrors';
import { AddUserUseCase } from './AddUserUseCase';

export class AddUserController extends HttpController {
  private useCase: AddUserUseCase;

  constructor(useCase: AddUserUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as AddUserDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case AddUserErrors.UserExists:
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

import { HttpController } from '../../../../core/infrastructure';
import { CreateAccountDTO } from './CreateAccountDTO';
import { CreateAccountErrors } from './CreateAccountErrors';
import { CreateAccountUseCase } from './CreateAccountUseCase';

export class CreateAccountController extends HttpController {
  private useCase: CreateAccountUseCase;

  constructor(useCase: CreateAccountUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as CreateAccountDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case CreateAccountErrors.AccountExists:
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

import { HttpController } from '../../../../core/infrastructure';
import { AuthenticateAccountDTO } from './AuthenticateAccountDTO';
import { AuthenticateAccountErrors } from './AuthenticateAccountErrors';
import { AuthenticateAccountUseCase } from './AuthenticateAccountUseCase';

export class AuthenticateAccountController extends HttpController {
  private useCase: AuthenticateAccountUseCase;

  constructor(useCase: AuthenticateAccountUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as AuthenticateAccountDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case AuthenticateAccountErrors.UnknownError:
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

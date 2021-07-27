import { HttpController } from '../../../../core/infrastructure';
import { GetOrderDTO } from './GetOrderDTO';
import { GetOrderErrors } from './GetOrderErrors';
import { GetOrderUseCase } from './GetOrderUseCase';

export class GetOrderController extends HttpController {
  private useCase: GetOrderUseCase;

  constructor(useCase: GetOrderUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as GetOrderDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case GetOrderErrors.TokenNotFound:
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

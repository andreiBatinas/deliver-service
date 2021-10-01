import { HttpController } from '../../../../core/infrastructure';
import { UpdateOrderDTO } from './UpdateOrderDTO';
import { UpdateOrderErrors } from './UpdateOrderErrors';
import { UpdateOrderUseCase } from './UpdateOrderUseCase';

export class UpdateOrderController extends HttpController {
  private useCase: UpdateOrderUseCase;

  constructor(useCase: UpdateOrderUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as UpdateOrderDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case UpdateOrderErrors.OrderDoesntExists:
        return this.badRequest(err.errorValue());
      case UpdateOrderErrors.TokenNotFound:
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

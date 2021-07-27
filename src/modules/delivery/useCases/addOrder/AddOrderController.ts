import { HttpController } from '../../../../core/infrastructure';
import { AddOrderDTO } from './AddOrderDTO';
import { AddOrderErrors } from './AddOrderErrors';
import { AddOrderUseCase } from './AddOrderUseCase';

export class AddOrderController extends HttpController {
  private useCase: AddOrderUseCase;

  constructor(useCase: AddOrderUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as AddOrderDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case AddOrderErrors.OrderExists:
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

import { HttpController } from '../../../../core/infrastructure';
import { ListOrderDTO } from './ListOrderDTO';
import { ListOrderErrors } from './ListOrderErrors';
import { ListOrderUseCase } from './ListOrderUseCase';

export class ListOrderController extends HttpController {
  private useCase: ListOrderUseCase;

  constructor(useCase: ListOrderUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as ListOrderDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case ListOrderErrors.TokenNotFound:
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

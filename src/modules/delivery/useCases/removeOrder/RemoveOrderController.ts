import { HttpController } from '../../../../core/infrastructure';
import { RemoveOrderDTO } from './RemoveOrderDTO';
import { RemoveOrderErrors } from './RemoveOrderErrors';
import { RemoveOrderUseCase } from './RemoveOrderUseCase';

export class RemoveOrderController extends HttpController {
  private useCase: RemoveOrderUseCase;

  constructor(useCase: RemoveOrderUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as RemoveOrderDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case RemoveOrderErrors.TokenNotFound:
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

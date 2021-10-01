import { HttpController } from '../../../../core/infrastructure';
import { RemoveRestaurantDTO } from './RemoveRestaurantDTO';
import { RemoveRestaurantErrors } from './RemoveRestaurantErrors';
import { RemoveRestaurantUseCase } from './RemoveRestaurantUseCase';

export class RemoveRestaurantController extends HttpController {
  private useCase: RemoveRestaurantUseCase;

  constructor(useCase: RemoveRestaurantUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as RemoveRestaurantDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case RemoveRestaurantErrors.TokenNotFound:
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

import { HttpController } from '../../../../core/infrastructure';
import { GetRestaurantDTO } from './GetRestaurantDTO';
import { GetRestaurantErrors } from './GetRestaurantErrors';
import { GetRestaurantUseCase } from './GetRestaurantUseCase';

export class GetRestaurantController extends HttpController {
  private useCase: GetRestaurantUseCase;

  constructor(useCase: GetRestaurantUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as GetRestaurantDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case GetRestaurantErrors.TokenNotFound:
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

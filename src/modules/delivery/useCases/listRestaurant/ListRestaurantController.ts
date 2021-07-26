import { HttpController } from '../../../../core/infrastructure';
import { ListRestaurantDTO } from './ListRestaurantDTO';
import { ListRestaurantErrors } from './ListRestaurantErrors';
import { ListRestaurantUseCase } from './ListRestaurantUseCase';

export class ListRestaurantController extends HttpController {
  private useCase: ListRestaurantUseCase;

  constructor(useCase: ListRestaurantUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as ListRestaurantDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case ListRestaurantErrors.TokenNotFound:
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

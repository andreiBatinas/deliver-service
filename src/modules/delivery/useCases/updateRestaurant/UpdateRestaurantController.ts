import { HttpController } from '../../../../core/infrastructure';
import { UpdateRestaurantDTO } from './UpdateRestaurantDTO';
import { UpdateRestaurantErrors } from './UpdateRestaurantErrors';
import { UpdateRestaurantUseCase } from './UpdateRestaurantUseCase';

export class UpdateRestaurantController extends HttpController {
  private useCase: UpdateRestaurantUseCase;

  constructor(useCase: UpdateRestaurantUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as UpdateRestaurantDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case UpdateRestaurantErrors.RestaurantDoesntExists:
        return this.badRequest(err.errorValue());
      case UpdateRestaurantErrors.TokenNotFound:
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

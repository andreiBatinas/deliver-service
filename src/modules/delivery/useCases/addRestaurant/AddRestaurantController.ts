import { HttpController } from '../../../../core/infrastructure';
import { AddRestaurantDTO } from './AddRestaurantDTO';
import { AddRestaurantErrors } from './AddRestaurantErrors';
import { AddRestaurantUseCase } from './AddRestaurantUseCase';

export class AddRestaurantController extends HttpController {
  private useCase: AddRestaurantUseCase;

  constructor(useCase: AddRestaurantUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as AddRestaurantDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case AddRestaurantErrors.RestaurantExists:
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

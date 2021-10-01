import { HttpController } from '../../../../core/infrastructure';
import { UpdateFleetDTO } from './UpdateFleetDTO';
import { UpdateFleetErrors } from './UpdateFleetErrors';
import { UpdateFleetUseCase } from './UpdateFleetUseCase';

export class UpdateFleetController extends HttpController {
  private useCase: UpdateFleetUseCase;

  constructor(useCase: UpdateFleetUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as UpdateFleetDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case UpdateFleetErrors.FleetExists:
        return this.badRequest(err.errorValue());
      case UpdateFleetErrors.TokenNotFound:
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

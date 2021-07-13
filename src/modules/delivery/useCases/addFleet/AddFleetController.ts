import { HttpController } from '../../../../core/infrastructure';
import { AddFleetDTO } from './AddFleetDTO';
import { AddFleetErrors } from './AddFleetErrors';
import { AddFleetUseCase } from './AddFleetUseCase';

export class AddFleetController extends HttpController {
  private useCase: AddFleetUseCase;

  constructor(useCase: AddFleetUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as AddFleetDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case AddFleetErrors.FleetExists:
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

import { HttpController } from '../../../../core/infrastructure';
import { RemoveFleetDTO } from './RemoveFleetDTO';
import { RemoveFleetErrors } from './RemoveFleetErrors';
import { RemoveFleetUseCase } from './RemoveFleetUseCase';

export class RemoveFleetController extends HttpController {
  private useCase: RemoveFleetUseCase;

  constructor(useCase: RemoveFleetUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as RemoveFleetDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case RemoveFleetErrors.TokenNotFound:
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

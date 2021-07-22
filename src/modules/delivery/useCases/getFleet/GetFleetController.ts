import { HttpController } from '../../../../core/infrastructure';
import { GetFleetDTO } from './GetFleetDTO';
import { GetFleetErrors } from './GetFleetErrors';
import { GetFleetUseCase } from './GetFleetUseCase';

export class GetFleetController extends HttpController {
  private useCase: GetFleetUseCase;

  constructor(useCase: GetFleetUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as GetFleetDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case GetFleetErrors.TokenNotFound:
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

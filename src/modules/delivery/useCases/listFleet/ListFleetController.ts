import { HttpController } from '../../../../core/infrastructure';
import { ListFleetDTO } from './ListFleetDTO';
import { ListFleetErrors } from './ListFleetErrors';
import { ListFleetUseCase } from './ListFleetUseCase';

export class ListFleetController extends HttpController {
  private useCase: ListFleetUseCase;

  constructor(useCase: ListFleetUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as ListFleetDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.serviceOk(this.res, result.value.getValue() as any);
    }

    const err = result.value;
    switch (err.constructor) {
      case ListFleetErrors.TokenNotFound:
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

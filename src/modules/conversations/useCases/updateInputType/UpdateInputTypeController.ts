import { HttpController } from '../../../../core/infrastructure';
import { UpdateInputTypeDTO } from './UpdateInputTypeDTO';
import { UpdateInputTypeErrors } from './UpdateInputTypeErrors';
import { UpdateInputTypeUseCase } from './UpdateInputTypeUseCase';

export class UpdateInputTypeController extends HttpController {
  private useCase: UpdateInputTypeUseCase;

  constructor(useCase: UpdateInputTypeUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as UpdateInputTypeDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case UpdateInputTypeErrors.InputTypeExists:
        return this.badRequest(err.errorValue());
      default:
        return this.fail(err.errorValue());
    }
  }
}

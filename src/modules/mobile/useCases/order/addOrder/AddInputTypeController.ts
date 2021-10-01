import { HttpController } from '../../../../../core/infrastructure';
import { AddInputTypeDTO } from './AddInputTypeDTO';
import { AddInputTypeErrors } from './AddInputTypeErrors';
import { AddInputTypeUseCase } from './AddInputTypeUseCase';

export class AddInputTypeController extends HttpController {
  private useCase: AddInputTypeUseCase;

  constructor(useCase: AddInputTypeUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as AddInputTypeDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case AddInputTypeErrors.InputTypeExists:
        return this.badRequest(err.errorValue());
      default:
        return this.fail(err.errorValue());
    }
  }
}

import { HttpController } from '../../../../core/infrastructure';
import { UpdateModuleDTO } from './UpdateModuleDTO';
import { UpdateModuleErrors } from './UpdateModuleErrors';
import { UpdateModuleUseCase } from './UpdateModuleUseCase';

export class UpdateModuleController extends HttpController {
  private useCase: UpdateModuleUseCase;

  constructor(useCase: UpdateModuleUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as UpdateModuleDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case UpdateModuleErrors.ModuleExists:
        return this.badRequest(err.errorValue());
      default:
        return this.fail(err.errorValue());
    }
  }
}

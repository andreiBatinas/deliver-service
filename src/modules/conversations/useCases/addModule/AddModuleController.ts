import { HttpController } from '../../../../core/infrastructure';
import { AddModuleDTO } from './AddModuleDTO';
import { AddModuleErrors } from './AddModuleErrors';
import { AddModuleUseCase } from './AddModuleUseCase';

export class AddModuleController extends HttpController {
  private useCase: AddModuleUseCase;

  constructor(useCase: AddModuleUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as AddModuleDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case AddModuleErrors.ModuleExists:
        return this.badRequest(err.errorValue());
      default:
        return this.fail(err.errorValue());
    }
  }
}

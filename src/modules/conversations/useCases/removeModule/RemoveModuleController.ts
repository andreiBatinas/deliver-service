import { HttpController } from '../../../../core/infrastructure';
import { RemoveModuleDTO } from './RemoveModuleDTO';
import { RemoveModuleErrors } from './RemoveModuleErrors';
import { RemoveModuleUseCase } from './RemoveModuleUseCase';

export class RemoveModuleController extends HttpController {
  private useCase: RemoveModuleUseCase;

  constructor(useCase: RemoveModuleUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as RemoveModuleDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case RemoveModuleErrors.TokenNotFound:
        return this.badRequest(err.errorValue());
      default:
        return this.fail(err.errorValue());
    }
  }
}

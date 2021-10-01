import { HttpController } from '../../../../core/infrastructure';
import { ListModuleDTO } from './ListModuleDTO';
import { ListModuleErrors } from './ListModuleErrors';
import { ListModuleUseCase } from './ListModuleUseCase';

export class ListModuleController extends HttpController {
  private useCase: ListModuleUseCase;

  constructor(useCase: ListModuleUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as ListModuleDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case ListModuleErrors.TokenNotFound:
        return this.badRequest(err.errorValue());
      default:
        return this.fail(err.errorValue().message);
    }
  }
}

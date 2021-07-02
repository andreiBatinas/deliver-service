import { HttpController } from '../../../../core/infrastructure';
import { ListConversationDTO } from './ListConversationDTO';
import { ListConversationErrors } from './ListConversationErrors';
import { ListConversationUseCase } from './ListConversationUseCase';

export class ListConversationController extends HttpController {
  private useCase: ListConversationUseCase;

  constructor(useCase: ListConversationUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as ListConversationDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case ListConversationErrors.TokenNotFound:
        return this.badRequest(err.errorValue().message);
      default:
        return this.fail(err.errorValue().message);
    }
  }
}

import { HttpController } from '../../../../../core/infrastructure';
import { RemoveConversationDTO } from './RemoveConversationDTO';
import { RemoveConversationErrors } from './RemoveConversationErrors';
import { RemoveConversationUseCase } from './RemoveConversationUseCase';

export class RemoveConversationController extends HttpController {
  private useCase: RemoveConversationUseCase;

  constructor(useCase: RemoveConversationUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as RemoveConversationDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case RemoveConversationErrors.TokenNotFound:
        return this.badRequest(err.errorValue().message);
      default:
        return this.fail(err.errorValue().message);
    }
  }
}

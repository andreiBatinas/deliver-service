import { HttpController } from '../../../../core/infrastructure';
import { UpdateConversationDTO } from './UpdateConversationDTO';
import { UpdateConversationErrors } from './UpdateConversationErrors';
import { UpdateConversationUseCase } from './UpdateConversationUseCase';

export class UpdateConversationController extends HttpController {
  private useCase: UpdateConversationUseCase;

  constructor(useCase: UpdateConversationUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    
    const dto = this.req.body as UpdateConversationDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case UpdateConversationErrors.TokenNotFound:
        return this.badRequest(err.errorValue().message);
      default:
        return this.fail(err.errorValue().message);
    }
  }
}

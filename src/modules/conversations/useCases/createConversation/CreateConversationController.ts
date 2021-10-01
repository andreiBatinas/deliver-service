import { HttpController } from '../../../../core/infrastructure';
import { CreateConversationDTO } from './CreateConversationDTO';
import { CreateConversationErrors } from './CreateConversationErrors';
import { CreateConversationUseCase } from './CreateConversationUseCase';

export class CreateConversationController extends HttpController {
  private useCase: CreateConversationUseCase;

  constructor(useCase: CreateConversationUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as CreateConversationDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case CreateConversationErrors.ConversationExists:
        return this.badRequest(err.errorValue());
      default:
        return this.fail(err.errorValue());
    }
  }
}

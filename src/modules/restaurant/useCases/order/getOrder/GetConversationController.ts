import { HttpController } from '../../../../../core/infrastructure';
import { GetConversationDTO } from './GetConversationDTO';
import { GetConversationErrors } from './GetConversationErrors';
import { GetConversationUseCase } from './GetConversationUseCase';

export class GetConversationController extends HttpController {
  private useCase: GetConversationUseCase;

  constructor(useCase: GetConversationUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl(): Promise<any> {
    const dto = this.req.body as GetConversationDTO;
    const result = await this.useCase.execute(dto);

    if (result.isRight()) {
      return this.ok(this.res, result.value.getValue());
    }

    const err = result.value;
    switch (err.constructor) {
      case GetConversationErrors.TokenNotFound:
        return this.badRequest(err.errorValue().message);
      default:
        return this.fail(err.errorValue().message);
    }
  }
}

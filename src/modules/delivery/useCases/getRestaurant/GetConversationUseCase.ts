import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { Conversation } from '../../domain/oldDomain/Conversation';
import { ConversationId } from '../../domain/oldDomain/ConversationId';
import { ConversationIdMap } from '../../mappers/oldMapper/ConversationIdMap';
import { ConversationMap } from '../../mappers/oldMapper/ConversationMap';
import { IConversationRepo } from '../../repos/oldRepo/ConversationRepo';
import { GetConversationDTO } from './GetConversationDTO';
import { GetConversationErrors } from './GetConversationErrors';
import { GetConversationResponse } from './GetConversationResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class GetConversationUseCase
  implements UseCase<GetConversationDTO, Response>
{
  private conversationRepo: IConversationRepo;

  constructor(conversationRepo: IConversationRepo) {
    this.conversationRepo = conversationRepo;
  }

  public async execute(req: GetConversationDTO): Promise<Response> {
    const log = new Logger('GetConversationUseCase');
    log.debug('execute *******');
    log.debug(req);
    const c = ConversationIdMap.toDomain(req);
    const conversationIdOrError = ConversationId.New(c);

    if (conversationIdOrError.isFailure) {
      return wrong(
        Result.Fail<ConversationId>(conversationIdOrError.error),
      ) as Response;
    }

    try {
      const coversationFromDb =
        await this.conversationRepo.findConversationByConversationId(
          c.conversationId,
        );
      const data = ConversationMap.toFrontend(
        coversationFromDb as Conversation,
      );

      const result: GetConversationResponse = {
        result: 'ok',
        data,
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new GetConversationErrors.UnknownError(e)) as Response;
    }
  }
}

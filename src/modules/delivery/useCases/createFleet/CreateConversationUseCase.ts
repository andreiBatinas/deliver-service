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
import { ConversationMap } from '../../mappers/oldMapper/ConversationMap';
import { IConversationRepo } from '../../repos/oldRepo/ConversationRepo';
import { CreateConversationDTO } from './CreateConversationDTO';
import { CreateConversationErrors } from './CreateConversationErrors';
import { CreateConversationResponse } from './CreateConversationResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class CreateConversationUseCase
  implements UseCase<CreateConversationDTO, Response>
{
  private conversationRepo: IConversationRepo;

  constructor(conversationRepo: IConversationRepo) {
    this.conversationRepo = conversationRepo;
  }

  public async execute(req: CreateConversationDTO): Promise<Response> {
    const log = new Logger('UpdateTokenUseCase');

    const c = ConversationMap.toDomain(req);
    const conversationOrError = Conversation.New(c);

    if (conversationOrError.isFailure) {
      return wrong(
        Result.Fail<Conversation>(conversationOrError.error),
      ) as Response;
    }

    try {
      const conversation = conversationOrError.getValue() as Conversation;
      const exist = await this.conversationRepo.exists(
        conversation.name,
        conversation.campaignId,
      );

      if (exist) {
        return wrong(
          new CreateConversationErrors.ConversationExists(conversation.name),
        ) as Response;
      }
      const r = await this.conversationRepo.save(conversation);

      const result: CreateConversationResponse = {
        result: 'ok',
        data: ConversationMap.toFrontend(r),
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new CreateConversationErrors.UnknownError(e)) as Response;
    }
  }
}

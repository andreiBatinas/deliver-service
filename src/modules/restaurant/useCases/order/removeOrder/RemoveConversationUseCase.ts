import { UseCase } from '../../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../../core/logic';
import { Logger } from '../../../../../infrastructure/logger';
import { Conversation } from '../../../domain/Conversation';
import { ConversationCampaign } from '../../../domain/ConversationCampaign';
import { ConversationId } from '../../../domain/ConversationId';
import { ConversationCampaignMap } from '../../../mappers/ConversationCampaignMap';
import { IConversationRepo } from '../../../repos/ConversationRepo';
import { RemoveConversationDTO } from './RemoveConversationDTO';
import { RemoveConversationErrors } from './RemoveConversationErrors';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class RemoveConversationUseCase
  implements UseCase<RemoveConversationDTO, Response> {
  private conversationRepo: IConversationRepo;

  constructor(conversationRepo: IConversationRepo) {
    this.conversationRepo = conversationRepo;
  }

  public async execute(req: RemoveConversationDTO): Promise<Response> {
    const log = new Logger('UpdateTokenUseCase');

    const c = ConversationCampaignMap.toDomain(req);
    const conversationIdOrError = ConversationCampaign.New(c);

    if (conversationIdOrError.isFailure) {
      return wrong(
        Result.Fail<ConversationId>(conversationIdOrError.error),
      ) as Response;
    }
    try {
      const conversation = (await this.conversationRepo.findConversationByConversationId(
        c.conversationId,
      )) as Conversation;
      if (conversation.campaignId !== c.campaignId) {
        return wrong(
          new RemoveConversationErrors.ConversationDontBelongToCampaign(
            c.conversationId,
            c.campaignId,
          ),
        ) as Response;
      }
      const response = await this.conversationRepo.removeConversationByConversationId(
        c.conversationId,
      );
      if (response === false) {
        return wrong(
          new RemoveConversationErrors.UnknownError(c.conversationId),
        ) as Response;
      }
      const result = {
        result: 'ok',
        data: {},
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new RemoveConversationErrors.UnknownError(e)) as Response;
    }
  }
}

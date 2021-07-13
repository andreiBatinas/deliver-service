import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { CreateConversationResponse } from '../../../conversations/useCases/createConversation/CreateConversationResponse';
import { Conversation } from '../../domain/oldDomain/Conversation';
import { ConversationCampaign } from '../../domain/oldDomain/ConversationCampaign';
import { ConversationMap } from '../../mappers/oldMapper/ConversationMap';
import { IConversationRepo } from '../../repos/oldRepo/ConversationRepo';
import { UpdateConversationDTO } from './UpdateConversationDTO';
import { UpdateConversationErrors } from './UpdateConversationErrors';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class UpdateConversationUseCase
  implements UseCase<UpdateConversationDTO, Response>
{
  private conversationRepo: IConversationRepo;

  constructor(conversationRepo: IConversationRepo) {
    this.conversationRepo = conversationRepo;
  }
  public async execute(req: UpdateConversationDTO): Promise<Response> {
    const log = new Logger('UpdateTokenUseCase');

    const c = ConversationMap.toDomain(req);
    const conversationOrError = ConversationCampaign.New(c);
    if (conversationOrError.isFailure) {
      return wrong(
        Result.Fail<ConversationCampaign>(conversationOrError.error),
      ) as Response;
    }
    const conversation = conversationOrError.getValue() as Conversation;

    const conversationCheck =
      (await this.conversationRepo.findConversationByConversationId(
        c.conversationId,
      )) as Conversation;
    if (conversationCheck.campaignId !== c.campaignId) {
      return wrong(
        new UpdateConversationErrors.ConversationDontBelongToCampaign(
          c.conversationId,
          c.campaignId,
        ),
      ) as Response;
    }
    try {
      const r = await this.conversationRepo.updateConversation(conversation);
      if (r === null) {
        return wrong(
          Result.Fail<ConversationCampaign>(conversationOrError.error),
        ) as Response;
      }

      const result: CreateConversationResponse = {
        result: 'ok',
        data: ConversationMap.toFrontend(r),
      };
      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new UpdateConversationErrors.UnknownError(e)) as Response;
    }
  }
}

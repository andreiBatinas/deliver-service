import { UseCase } from '../../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../../core/logic';
import { Logger } from '../../../../../infrastructure/logger';
import { CampaignId } from '../../../domain/CampaignId';
import { CampaignIdMap } from '../../../mappers/CampaignIdMap';
import { ConversationMap } from '../../../mappers/ConversationMap';
import { IConversationRepo } from '../../../repos/ConversationRepo';
import { ListConversationDTO } from './ListConversationDTO';
import { ListConversationErrors } from './ListConversationErrors';
import { ListConversationResponse } from './ListConversationResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class ListConversationUseCase
  implements UseCase<ListConversationDTO, Response> {
  private conversationRepo: IConversationRepo;

  constructor(conversationRepo: IConversationRepo) {
    this.conversationRepo = conversationRepo;
  }

  public async execute(req: ListConversationDTO): Promise<Response> {
    const log = new Logger('ListConversationUseCase');

    const c = CampaignIdMap.toDomain(req);
    const campaignIdOrError = CampaignId.New(c);

    if (campaignIdOrError.isFailure) {
      return wrong(
        Result.Fail<CampaignId>(campaignIdOrError.error),
      ) as Response;
    }
    const campaign = campaignIdOrError.getValue() as CampaignId;

    try {
      const r = await this.conversationRepo.findConversationsByCampaignId(
        campaign.campaignId,
      );

      const resultList = r.map((entry: any) => {
        return ConversationMap.toFrontend(entry);
      });

      const result: ListConversationResponse = {
        result: 'ok',
        data: resultList,
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new ListConversationErrors.UnknownError(e)) as Response;
    }
  }
}

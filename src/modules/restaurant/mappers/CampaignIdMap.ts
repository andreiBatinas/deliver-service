import { Mapper } from '../../../core/infrastructure';
import { CampaignId } from '../domain/CampaignId';

export class CampaignIdMap extends Mapper<CampaignId> {
  public static toPersistent(conversation: CampaignId): any {
    return {
      campaignId: conversation.campaignId,
    };
  }

  static toDomain(raw: any): CampaignId {
    const conversationOrError = CampaignId.New({
      campaignId: raw.account_id,
    });
    return conversationOrError.getValue() as CampaignId;
  }

  static toFrontend(raw: CampaignId): any {
    return {
      account_id: raw.campaignId,
    };
  }
}

import { Mapper } from '../../../core/infrastructure';
import { Conversation } from '../domain/oldDomain/Conversation';

export interface IConversationCampaignMap {
  conversationId: string;
  campaignId: string;
}
export class ConversationCampaignMap extends Mapper<Conversation> {
  public static toPersistent(
    conversation: Conversation,
  ): IConversationCampaignMap {
    return {
      conversationId: conversation.conversationId,
      campaignId: conversation.campaignId,
    };
  }

  static toDomain(raw: any): IConversationCampaignMap {
    return {
      conversationId: raw.conversation_id,
      campaignId: raw.account_id,
    };
  }
  static toFrontend(raw: any): any {
    return {
      account_id: raw.campaignId,
      conversation_id: raw.conversationId,
    };
  }
}

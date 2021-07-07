import { Mapper } from '../../../core/infrastructure';
import { Conversation } from '../domain/oldDomain/Conversation';

export class ConversationIdMap extends Mapper<Conversation> {
  public static toPersistent(conversation: Conversation): any {
    return {
      conversationId: conversation.conversationId,
      campaignId: conversation.campaignId,
    };
  }

  static toDomain(raw: any): any {
    return {
      conversationId: raw.conversation_id,
      campaignId: raw.account_id,
    };
  }
}

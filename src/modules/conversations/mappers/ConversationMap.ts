import { Mapper } from '../../../core/infrastructure';
import { Conversation } from '../domain/Conversation';

export class ConversationMap extends Mapper<Conversation> {
  public static toPersistent(conversation: Conversation): any {
    return {
      conversationId: conversation.conversationId,
      name: conversation.name,
      campaignId: conversation.campaignId,
    };
  }

  static toDomain(raw: any): Conversation {
    const conversationOrError = Conversation.New({
      campaignId: raw.account_id,
      name: raw.name,
      conversationId: raw.conversation_id,
    });

    return conversationOrError.getValue() as Conversation;
  }

  static toDomainFromDb(raw: any): Conversation {
    const conversationOrError = Conversation.New({
      campaignId: raw.campaignId,
      name: raw.name,
      conversationId: raw.conversationId,
    });

    return conversationOrError.getValue() as Conversation;
  }

  static toFrontend(raw: Conversation): any {
    return {
      conversation_id: raw.conversationId,
      name: raw.name,
      account_id: raw.campaignId,
    };
  }
}

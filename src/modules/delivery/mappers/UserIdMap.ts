import { Mapper } from '../../../core/infrastructure';
import { User } from '../domain/User';

export class UserIdMap extends Mapper<User> {
  public static toBackend(user: any): any {
    return {
      userId: user.userId,
    };
  }

  public static toPersistent(user: any): any {
    return {
      userId: user.userId,
    };
  }

  // static toDomain(raw: any): Conversation {
  //   const conversationOrError = Conversation.New({
  //     campaignId: raw.account_id,
  //     name: raw.name,
  //     conversationId: raw.conversation_id,
  //   });

  //   return conversationOrError.getValue() as Conversation;
  // }

  // static toDomainFromDb(raw: any): Conversation {
  //   const conversationOrError = Conversation.New({
  //     campaignId: raw.campaignId,
  //     name: raw.name,
  //     conversationId: raw.conversationId,
  //   });

  //   return conversationOrError.getValue() as Conversation;
  // }

  static toFrontend(raw: any): any {
    return {
      userId: raw.userId,
    };
  }
}

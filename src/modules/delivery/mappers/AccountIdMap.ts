import { Mapper } from '../../../core/infrastructure';
import { Account } from '../domain/Account';

export class AccountIdMap extends Mapper<Account> {
  public static toBackend(account: any): any {
    return {
      accountId: account.accountId,
    };
  }

  public static toPersistent(account: any): any {
    return {
      accountId: account.accountId,
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
      accountId: raw.accountId,
    };
  }
}

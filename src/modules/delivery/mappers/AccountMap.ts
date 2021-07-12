import { Mapper } from '../../../core/infrastructure';
import { Account } from '../domain/Account';

export class AccountMap extends Mapper<Account> {
  public static toBackend(account: any): any {
    return {
      accountName: account.accountName,
      accountPassword: account.accountPassword,
      accountEmail: account.accountEmail,
      accountTelephone: account.accountTelephone,
      accountOfficeAddress: account.accountOfficeAddress,
      accountCUI: account.accountCUI,
      accountCreatedAt: account.accountCreatedAt,
      accountUpdatedAt: account.accountUpdatedAt,
    };
  }

  public static toBackendFromAuth(account: any): any {
    return {
      accountPassword: account.accountPassword,
      accountEmail: account.accountEmail,
    };
  }

  public static toPersistent(account: any): any {
    return {
      accountName: account.accountName,
      accountPassword: account.accountPassword,
      accountEmail: account.accountEmail,
      accountTelephone: account.accountTelephone,
      accountOfficeAddress: account.accountOfficeAddress,
      accountCUI: account.accountCUI,
      accountCreatedAt: account.accountCreatedAt,
      accountUpdatedAt: account.accountUpdatedAt,
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

  static toFrontend(raw: Account): any {
    return {
      accountCUI: raw.accountCUI,
      accountEmail: raw.accountEmail,
      accountName: raw.accountName,
      accountCreatedAt: raw.accountCreatedAt,
      accountPassword: raw.accountPassword,
      accountUpdatedAt: raw.accountUpdatedAt,
      accountOfficeAddress: raw.accountOfficeAddress,
      accountTelephone: raw.accountTelephone,
    };
  }
  static toFrontEdFromAuth(raw: Account): any {
    return {
      accountPassword: raw.accountPassword,
      accountEmail: raw.accountEmail,
    };
  }
}

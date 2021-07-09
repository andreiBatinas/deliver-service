import { DeleteResult } from 'typeorm';
import { DB } from '../../../infrastructure/typeorm';
import { Account } from '../domain/Account';
import { AccountMap } from '../mappers/AccountMap';

export interface IAccountRepo {
  //findAccountByAccountName(name: string): Promise<Account | null>;
  //findAccountByAccountId(accountId: string): Promise<Account | null>;
  save(account: Account): Promise<Account>;
  exists(accountEmail: string): Promise<boolean>;
  //findConversationsByCampaignId(campaignId: string): Promise<Account[]>;

  //findModulesByConversationId(conversationId: string): Promise<Account[]>;
  //removeAccountByAccountId(accountId: string): Promise<boolean>;
  //updateAccount(account: Account): Promise<Account | null>;
}

export class AccountRepo implements IAccountRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(accountEmail: string): Promise<boolean> {
    const accountModel = this.models.Account;
    const r = await DB.getRepository(accountModel).findOne({
      accountEmail,
    });
    if (r !== undefined) return true;
    return false;
  }

  // public async findAccountByAccountName(name: string): Promise<Account | null> {
  //   const accountModel = this.models.Account;
  //   const account = await DB.getRepository(accountModel).findOne({
  //     where: {
  //       name,
  //     },
  //   });

  //   if (undefined === account) {
  //     return null;
  //   }
  //   return account as Account;
  // }

  public async save(account: Account): Promise<Account> {
    const accountModel = this.models.Account;
    const rawAccount = AccountMap.toPersistent(account);

    const accountRepo = DB.getRepository(accountModel);
    const c = new accountModel();

    c.accountName = rawAccount.accountName;
    c.accountPassword = rawAccount.accountPassword;
    c.accountEmail = rawAccount.accountEmail;
    c.accountTelephone = rawAccount.accountTelephone;
    c.accountOfficeAddress = rawAccount.accountOfficeAddress;
    c.accountCUI = rawAccount.accountCUI;
    c.accountCreatedAt = rawAccount.accountCreatedAt;
    c.accountUpdatedAt = rawAccount.accountUpdatedAt;

    const accountResult = await accountRepo.save(c);
    return accountResult;
  }

  // public async findConversationsByCampaignId(
  //   campaignId: string,
  // ): Promise<Account[]> {
  //   const conversationModel = this.models.Conversation;
  //   const r = await DB.getRepository(conversationModel).find({
  //     where: {
  //       campaignId,
  //     },
  //   });

  //   const conversationList = r.map((entry: any) => {
  //     return ConversationMap.toDomainFromDb(entry);
  //   });

  //   return conversationList;
  // }
  // public async findAccountByAccountId(
  //   accountId: string,
  // ): Promise<Account | null> {
  //   const accountModel = this.models.Account;
  //   const account = await DB.getRepository(accountModel).findOne({
  //     where: {
  //       accountId,
  //     },
  //     relations: ['modules'],
  //   });

  //   if (undefined === account) {
  //     return null;
  //   }
  //   return account as Account;
  // }

  // public async findModulesByConversationId(
  //   conversationId: string,
  // ): Promise<Account[]> {
  //   const conversationModel = this.models.Conversation;
  //   const conversation = await DB.getRepository(conversationModel).findOne({
  //     where: {
  //       conversationId,
  //     },
  //     relations: ['modules'],
  //   });

  //   return [];
  // }
  public async removeConversationByConversationId(
    conversationId: string,
  ): Promise<boolean> {
    const conversationModel = this.models.Conversation;
    const result: DeleteResult = await DB.getRepository(
      conversationModel,
    ).delete({ conversationId });

    if (result.affected === 0) {
      return false;
    }
    return true;
  }
  // public async updateConversation(
  //   conversation: Account,
  // ): Promise<Account | null> {
  //   const conversationModel = this.models.Conversation;
  //   const rawConversation = ConversationMap.toPersistent(conversation);
  //   const criteria = { conversationId: rawConversation.conversationId };

  //   const propertiesToUpdate = {
  //     name: rawConversation.name,
  //   };
  //   const result = await DB.getRepository(conversationModel).update(
  //     criteria,
  //     propertiesToUpdate,
  //   );
  //   if (undefined === result) {
  //     return null;
  //   }
  //   return rawConversation;
  // }
}

import { DeleteResult } from 'typeorm';
import { DB } from '../../../infrastructure/typeorm';
import { Account } from '../domain/Account';
import { ConversationMap } from '../mappers/ConversationMap';

export interface IAccountRepo {
  findAccountByAccountName(name: string): Promise<Account | null>;
  findAccountByAccountId(accountId: string): Promise<Account | null>;
  save(account: Account): Promise<Account>;
  //exists(name: string, campaignId: string): Promise<boolean>;
  //findConversationsByCampaignId(campaignId: string): Promise<Account[]>;

  //findModulesByConversationId(conversationId: string): Promise<Account[]>;
  removeAccountByAccountId(accountId: string): Promise<boolean>;
  updateAccount(account: Account): Promise<Account | null>;
}

export class AccountRepo implements IAccountRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  // public async exists(name: string,  campaignId: string): Promise<boolean> {
  //   const conversationModel = this.models.Conversation;
  //   const r = await DB.getRepository(conversationModel).findOne({ name, campaignId });
  //   return !!r === true;
  // }

  public async findAccountByAccountName(name: string): Promise<Account | null> {
    const accountModel = this.models.Account;
    const account = await DB.getRepository(accountModel).findOne({
      where: {
        name,
      },
    });

    if (undefined === account) {
      return null;
    }
    return account as Account;
  }

  public async save(conversation: Account): Promise<Account> {
    const conversationModel = this.models.Conversation;
    const rawConversation = ConversationMap.toPersistent(conversation);

    const conversationRepo = DB.getRepository(conversationModel);
    const c = new conversationModel();

    c.conversationId = rawConversation.conversationId;
    c.name = rawConversation.name;
    c.campaignId = rawConversation.campaignId;

    const conversationResult = await conversationRepo.save(c);
    return conversationResult;
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
  public async findAccountByAccountId(
    accountId: string,
  ): Promise<Account | null> {
    const accountModel = this.models.Account;
    const account = await DB.getRepository(accountModel).findOne({
      where: {
        accountId,
      },
      relations: ['modules'],
    });

    if (undefined === account) {
      return null;
    }
    return account as Account;
  }

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
  public async updateConversation(
    conversation: Account,
  ): Promise<Account | null> {
    const conversationModel = this.models.Conversation;
    const rawConversation = ConversationMap.toPersistent(conversation);
    const criteria = { conversationId: rawConversation.conversationId };

    const propertiesToUpdate = {
      name: rawConversation.name,
    };
    const result = await DB.getRepository(conversationModel).update(
      criteria,
      propertiesToUpdate,
    );
    if (undefined === result) {
      return null;
    }
    return rawConversation;
  }
}

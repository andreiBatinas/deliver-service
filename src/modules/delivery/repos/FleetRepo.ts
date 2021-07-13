import { DB } from '../../../infrastructure/typeorm';
import { Fleet } from '../domain/Fleet';
import { FleetMap } from '../mappers/FleetMap';

export interface IFleetRepo {
  //findAccountByAccountName(name: string): Promise<Account | null>;
  //findAccountByAccountId(accountId: string): Promise<Account | null>;
  save(fleet: Fleet): Promise<Fleet>;
  exists(fleetName: string): Promise<boolean>;
  //findConversationsByCampaignId(campaignId: string): Promise<Account[]>;

  //findModulesByConversationId(conversationId: string): Promise<Account[]>;
  //removeAccountByAccountId(accountId: string): Promise<boolean>;
  //updateAccount(account: Account): Promise<Account | null>;
}

export class FleetRepo implements IFleetRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(fleetName: string): Promise<boolean> {
    const fleetModel = this.models.Fleet;
    const r = await DB.getRepository(fleetModel).findOne({
      fleetName,
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

  public async save(fleet: Fleet): Promise<Fleet> {
    const fleetModel = this.models.Fleet;
    const rawFleet = FleetMap.toPersistent(fleet);

    const fleetRepo = DB.getRepository(fleetModel);
    const c = new fleetModel();

    c.fleetName = rawFleet.fleetName;
    c.fleetLocation = rawFleet.fleetLocation;
    c.accountId = rawFleet.accountId;
    c.fleetCreatedAt = rawFleet.fleetCreatedAt;
    c.fleetUpdatedAt = rawFleet.fleetUpdatedAt;

    const fleetResult = await fleetRepo.save(c);
    return fleetResult;
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
  // public async removeConversationByConversationId(
  //   conversationId: string,
  // ): Promise<boolean> {
  //   const conversationModel = this.models.Conversation;
  //   const result: DeleteResult = await DB.getRepository(
  //     conversationModel,
  //   ).delete({ conversationId });

  //   if (result.affected === 0) {
  //     return false;
  //   }
  //   return true;
  // }
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

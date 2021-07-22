import { DeleteResult } from 'typeorm';

import { DB } from '../../../infrastructure/typeorm';
import { Fleet } from '../domain/Fleet';
import { FleetMap } from '../mappers/FleetMap';

export interface IFleetRepo {
  //findAccountByAccountName(name: string): Promise<Account | null>;
  findFleetByFleetId(fleetId: number): Promise<Fleet | null>;
  save(fleet: Fleet): Promise<Fleet>;
  exists(fleetName: string): Promise<boolean>;
  //findConversationsByCampaignId(campaignId: string): Promise<Account[]>;

  //findModulesByConversationId(conversationId: string): Promise<Account[]>;
  removeFleetByFleetId(fleetId: number): Promise<boolean>;
  updateFleet(fleet: Fleet): Promise<Fleet | null>;
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
    c.fleetCreatedAt = rawFleet.fleetCreatedAt;
    c.fleetUpdatedAt = rawFleet.fleetUpdatedAt;
    c.accountId = rawFleet.accountId;

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
  public async findFleetByFleetId(fleetId: number): Promise<Fleet | null> {
    const fleetModel = this.models.Fleet;
    const fleet = await DB.getRepository(fleetModel).findOne({
      where: {
        fleetId,
      },
      //relations: ['modules'],
    });

    if (undefined === fleet) {
      return null;
    }
    return fleet as Fleet;
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
  public async removeFleetByFleetId(fleetId: number): Promise<boolean> {
    const fleetModel = this.models.Fleet;
    const result: DeleteResult = await DB.getRepository(fleetModel).delete({
      fleetId,
    });

    if (result.affected === 0) {
      return false;
    }
    return true;
  }
  public async updateFleet(fleet: Fleet): Promise<Fleet | null> {
    const fleetModel = this.models.Fleet;
    const rawFleet = FleetMap.toPersistent(fleet);
    const criteria = { fleetId: fleet.fleetId };
    const propertiesToUpdate: any = { fleetUpdatedAt: new Date() };
    if (rawFleet.fleetName) {
      propertiesToUpdate['fleetName'] = rawFleet.fleetName;
    }
    if (rawFleet.fleetLocation) {
      propertiesToUpdate['fleetLocation'] = rawFleet.fleetLocation;
    }

    const result = await DB.getRepository(fleetModel).update(
      criteria,
      propertiesToUpdate,
    );
    if (undefined === result) {
      return null;
    }
    return rawFleet;
  }
}

import { Mapper } from '../../../core/infrastructure';
import { Fleet } from '../domain/Fleet';

export class FleetMap extends Mapper<Fleet> {
  public static toBackend(fleet: any): any {
    return {
      fleetName: fleet.fleetName,
      fleetLocation: fleet.fleetLocation,
    };
  }

  public static toPersistent(fleet: any): any {
    return {
      fleetName: fleet.fleetName,
      fleetLocation: fleet.fleetLocation,
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

  static toDomainFromDb(raw: any): Fleet {
    const fleetOrError = Fleet.New({
      fleetId: raw.fleetId,
      accountId: raw.accountId,
      fleetName: raw.fleetName,
      fleetLocation: raw.fleetLocation,
      fleetCreatedAt: raw.fleetCreatedAt,
      fleetUpdatedAt: raw.fleetUpdatedAt,
    });

    return fleetOrError.getValue() as Fleet;
  }

  static toFrontend(raw: Fleet): any {
    return {
      fleetId: raw.fleetId,
      fleetName: raw.fleetName,
      fleetLocation: raw.fleetLocation,
      fleetCreatedAt: raw.fleetCreatedAt,
      fleetUpdatedAt: raw.fleetUpdatedAt,
      accountId: raw.accountId,
    };
  }
}

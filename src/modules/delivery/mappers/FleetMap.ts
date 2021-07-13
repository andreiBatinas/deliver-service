import { Mapper } from '../../../core/infrastructure';
import { Fleet } from '../domain/Fleet';

export class FleetMap extends Mapper<Fleet> {
  public static toBackend(fleet: any): any {
    return {
      fleetName: fleet.fleetName,
      fleetLocation: fleet.fleetLocation,
      accountId: fleet.accountId,
      fleetCreatedAt: fleet.fleetCreatedAt,
      fleetUpdatedAt: fleet.fleetUpdatedAt,
    };
  }

  public static toPersistent(fleet: any): any {
    return {
      fleetName: fleet.fleetName,
      fleetLocation: fleet.fleetLocation,
      accountId: fleet.accountId,
      fleetCreatedAt: fleet.fleetCreatedAt,
      fleetUpdatedAt: fleet.fleetUpdatedAt,
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

  static toFrontend(raw: Fleet): any {
    return {
      fleetName: raw.fleetName,
      fleetLocation: raw.fleetLocation,
      accountId: raw.accountId,
      fleetCreatedAt: raw.fleetCreatedAt,
      fleetUpdatedAt: raw.fleetUpdatedAt,
    };
  }
}

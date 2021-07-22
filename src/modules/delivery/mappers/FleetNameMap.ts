import { Mapper } from '../../../core/infrastructure';
import { Fleet } from '../domain/Fleet';

export class FleetNameMap extends Mapper<Fleet> {
  public static toBackend(fleet: any): any {
    return {
      fleetName: fleet.fleetName,
    };
  }

  public static toPersistent(fleet: any): any {
    return {
      fleetName: fleet.fleetName,
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
      fleetName: raw.fleetName,
    };
  }
}

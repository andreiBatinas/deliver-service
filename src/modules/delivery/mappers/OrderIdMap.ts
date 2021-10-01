import { Mapper } from '../../../core/infrastructure';
import { Order } from '../domain/Order';

export class OrderIdMap extends Mapper<Order> {
  public static toBackend(order: any): any {
    return {
      orderId: order.orderId,
    };
  }

  public static toPersistent(order: any): any {
    return {
      orderId: order.orderId,
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
      orderId: raw.orderId,
    };
  }
}

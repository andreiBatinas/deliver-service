import { Mapper } from '../../../core/infrastructure';
import { Order } from '../domain/Order';

export class OrderMap extends Mapper<Order> {
  public static toBackend(order: any): any {
    return {
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      orderContent: order.orderContent,
      orderDeliveryAddress: order.orderDeliveryAddress,
      orderPickUpTime: order.orderPickUpTime,
      orderDeliveryTime: order.orderDeliveryTime,
      orderTelephoneClient: order.orderTelephoneClient,
      orderCreatedAt: order.orderCreatedAt,
      orderUpdatedAt: order.orderUpdatedAt,
      restaurantId: order.restaurantId,
    };
  }

  public static toPersistent(order: any): any {
    return {
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      orderContent: order.orderContent,
      orderDeliveryAddress: order.orderDeliveryAddress,
      orderPickUpTime: order.orderPickUpTime,
      orderDeliveryTime: order.orderDeliveryTime,
      orderTelephoneClient: order.orderTelephoneClient,
      orderCreatedAt: order.orderCreatedAt,
      orderUpdatedAt: order.orderUpdatedAt,
      restaurantId: order.restaurantId,
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

  static toDomainFromDb(raw: any): Order {
    const userOrError = Order.New({
      restaurantId: raw.restaurantId,
      orderNumber: raw.orderNumber,
      orderContent: raw.orderContent,
      orderDeliveryAddress: raw.orderDeliveryAddress,
      orderPickUpTime: raw.orderPickUpTime,
      orderDeliveryTime: raw.orderDeliveryTime,
      orderTelephoneClient: raw.orderTelephoneClient,
      orderCreatedAt: raw.orderCreatedAt,
      orderUpdatedAt: raw.orderUpdatedAt,
    });

    return userOrError.getValue() as Order;
  }

  static toFrontend(raw: Order): any {
    return {
      restaurantId: raw.restaurantId,
      orderNumber: raw.orderNumber,
      orderContent: raw.orderContent,
      orderDeliveryAddress: raw.orderDeliveryAddress,
      orderPickUpTime: raw.orderPickUpTime,
      orderDeliveryTime: raw.orderDeliveryTime,
      orderTelephoneClient: raw.orderTelephoneClient,
      orderCreatedAt: raw.orderCreatedAt,
      orderUpdatedAt: raw.orderUpdatedAt,
    };
  }
}

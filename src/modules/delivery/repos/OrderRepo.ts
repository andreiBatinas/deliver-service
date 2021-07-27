import { DeleteResult } from 'typeorm';

import { DB } from '../../../infrastructure/typeorm';
import { Order } from '../domain/Order';
import { OrderMap } from '../mappers/OrderMap';

export interface IOrderRepo {
  //findAccountByAccountName(name: string): Promise<Account | null>;
  findOrderByOrderId(orderId: number): Promise<Order | null>;
  save(order: Order): Promise<Order>;
  exists(orderNumber: string): Promise<boolean>;
  findOrdersByRestaurantId(restaurantId: number): Promise<Order[]>;

  //findModulesByConversationId(conversationId: string): Promise<Account[]>;
  removeOrderByOrderId(orderId: number): Promise<boolean>;
  updateOrder(order: Order): Promise<Order | null>;
}

export class OrderRepo implements IOrderRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(orderNumber: string): Promise<boolean> {
    const orderModel = this.models.Order;
    const r = await DB.getRepository(orderModel).findOne({
      orderNumber,
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

  public async save(order: Order): Promise<Order> {
    const orderModel = this.models.Order;
    const rawUser = OrderMap.toPersistent(order);

    const orderRepo = DB.getRepository(orderModel);
    const c = new orderModel();

    c.orderNumber = rawUser.orderNumber;
    c.orderContent = rawUser.orderContent;
    c.orderCreatedAt = rawUser.orderCreatedAt;
    c.orderUpdatedAt = rawUser.orderUpdatedAt;
    c.restaurantId = rawUser.restaurantId;
    c.orderPickUpTime = rawUser.orderPickUpTime;
    c.orderDeliveryAddress = rawUser.orderDeliveryAddress;
    c.orderDeliveryTime = rawUser.orderDeliveryTime;
    c.orderTelephoneClient = rawUser.orderTelephoneClient;

    const orderResult = await orderRepo.save(c);
    return orderResult;
  }

  public async findOrdersByRestaurantId(
    restaurantId: number,
  ): Promise<Order[]> {
    const orderModel = this.models.Order;
    const r = await DB.getRepository(orderModel).find({
      where: {
        restaurantId,
      },
    });

    const orderList = r.map((entry: any) => {
      return OrderMap.toDomainFromDb(entry);
    });

    return orderList;
  }

  public async findOrderByOrderId(orderId: number): Promise<Order | null> {
    const orderModel = this.models.Order;
    const order = await DB.getRepository(orderModel).findOne({
      where: {
        orderId,
      },
      //relations: ['modules'],
    });

    if (undefined === order) {
      return null;
    }
    return order as Order;
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
  public async removeOrderByOrderId(orderId: number): Promise<boolean> {
    const orderModel = this.models.Order;
    const result: DeleteResult = await DB.getRepository(orderModel).delete({
      orderId,
    });

    if (result.affected === 0) {
      return false;
    }
    return true;
  }

  public async updateOrder(order: Order): Promise<Order | null> {
    const orderModel = this.models.Order;
    const rawOrder = OrderMap.toPersistent(order);
    const criteria = { orderId: order.orderId };
    const propertiesToUpdate: any = { orderUpdatedAt: new Date() };
    if (rawOrder.orderContent) {
      propertiesToUpdate['orderContent'] = rawOrder.orderContent;
    }
    if (rawOrder.orderDeliveryAddress) {
      propertiesToUpdate['orderDeliveryAddress'] =
        rawOrder.orderDeliveryAddress;
    }
    if (rawOrder.orderDeliveryTime) {
      propertiesToUpdate['orderDeliveryTime'] = rawOrder.orderDeliveryTime;
    }
    if (rawOrder.orderPickUpTime) {
      propertiesToUpdate['orderPickUpTime'] = rawOrder.orderPickUpTime;
    }
    if (rawOrder.orderTelephoneClient) {
      propertiesToUpdate['orderTelephoneClient'] =
        rawOrder.orderTelephoneClient;
    }

    const result = await DB.getRepository(orderModel).update(
      criteria,
      propertiesToUpdate,
    );
    if (undefined === result) {
      return null;
    }
    return rawOrder;
  }
}

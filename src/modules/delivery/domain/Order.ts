import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface OrderProps {
  orderId?: number;
  orderNumber: string;
  orderContent: string;
  orderDeliveryAddress: string;
  orderPickUpTime: string;
  orderDeliveryTime: string;
  orderTelephoneClient: string;
  orderCreatedAt: string;
  orderUpdatedAt: string;
  restaurantId: number;
  //modules?: Module[];
}

export class Order extends Entity<OrderProps> {
  get orderId(): number {
    return this.props.orderId as number;
  }

  // get modules(): Module[] | undefined {
  //   return this.props.modules;
  // }

  get orderNumber(): string {
    return this.props.orderNumber;
  }

  get orderContent(): string {
    return this.props.orderContent;
  }

  get orderDeliveryAddress(): string {
    return this.props.orderDeliveryAddress;
  }

  get orderPickUpTime(): string {
    return this.props.orderPickUpTime;
  }

  get orderDeliveryTime(): string {
    return this.props.orderDeliveryTime;
  }

  get orderUpdatedAt(): string {
    return this.props.orderUpdatedAt;
  }

  get orderCreatedAt(): string {
    return this.props.orderCreatedAt;
  }

  get restaurantId(): number {
    return this.props.restaurantId;
  }

  get orderTelephoneClient(): string {
    return this.props.orderTelephoneClient;
  }

  constructor(props: OrderProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: OrderProps, id?: UniqueEntityId): Result<Order> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.orderNumber, argName: 'orderNumber' },
      { arg: props.orderContent, argName: 'orderContent' },
      { arg: props.orderDeliveryAddress, argName: 'orderDeliveryAddress' },
      { arg: props.orderPickUpTime, argName: 'orderPickUpTime' },
      { arg: props.orderDeliveryTime, argName: 'orderDeliveryTime' },
      { arg: props.orderTelephoneClient, argName: 'orderTelephoneClient' },
      { arg: props.restaurantId, argName: 'restaurantId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<Order>(validator.message);
    }

    const order = new Order(props, id);
    return Result.OK<Order>(order);
  }
}

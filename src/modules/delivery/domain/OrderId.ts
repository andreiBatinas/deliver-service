import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface OrderIdProps {
  orderId?: number;
}

export class OrderId extends Entity<OrderIdProps> {
  get orderId(): number {
    return this.props.orderId as number;
  }

  constructor(props: OrderIdProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: OrderIdProps, id?: UniqueEntityId): Result<OrderId> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.orderId, argName: 'orderId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<OrderId>(validator.message);
    }

    const order = new OrderId(props, id);
    return Result.OK<OrderId>(order);
  }
}

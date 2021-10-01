import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface RestaurantIdProps {
  restaurantId?: number;
}

export class RestaurantId extends Entity<RestaurantIdProps> {
  get restaurantId(): number {
    return this.props.restaurantId as number;
  }

  constructor(props: RestaurantIdProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: RestaurantIdProps,
    id?: UniqueEntityId,
  ): Result<RestaurantId> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.restaurantId, argName: 'restaurantId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<RestaurantId>(validator.message);
    }

    const restaurant = new RestaurantId(props, id);
    return Result.OK<RestaurantId>(restaurant);
  }
}

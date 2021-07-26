import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface RestaurantProps {
  restaurantId?: number;
  restaurantName: string;
  restaurantAddress: string;
  restaurantUsername: string;
  restaurantPassword: string;
  restaurantTelephone: string;
  restaurantCreatedAt: string;
  restaurantUpdatedAt: string;
  fleetId: number;
  //modules?: Module[];
}

export class Restaurant extends Entity<RestaurantProps> {
  get restaurantId(): number {
    return this.props.restaurantId as number;
  }

  // get modules(): Module[] | undefined {
  //   return this.props.modules;
  // }

  get restaurantName(): string {
    return this.props.restaurantName;
  }

  get restaurantAddress(): string {
    return this.props.restaurantAddress;
  }

  get restaurantUsername(): string {
    return this.props.restaurantUsername;
  }

  get restaurantPassword(): string {
    return this.props.restaurantPassword;
  }

  get restaurantTelephone(): string {
    return this.props.restaurantTelephone;
  }

  get restaurantUpdatedAt(): string {
    return this.props.restaurantUpdatedAt;
  }

  get restaurantCreatedAt(): string {
    return this.props.restaurantCreatedAt;
  }

  get fleetId(): number {
    return this.props.fleetId;
  }

  constructor(props: RestaurantProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: RestaurantProps, id?: UniqueEntityId): Result<Restaurant> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.restaurantName, argName: 'restaurantName' },
      { arg: props.restaurantAddress, argName: 'restaurantAddress' },
      { arg: props.restaurantUsername, argName: 'restaurantUsername' },
      { arg: props.restaurantPassword, argName: 'restaurantPassword' },
      { arg: props.restaurantTelephone, argName: 'restaurantTelephone' },
      { arg: props.fleetId, argName: 'fleetId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<Restaurant>(validator.message);
    }

    const restaurant = new Restaurant(props, id);
    return Result.OK<Restaurant>(restaurant);
  }
}

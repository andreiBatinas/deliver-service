import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface FleetLocationProps {
  fleetLocation: string;
}

export class FleetLocation extends Entity<FleetLocationProps> {
  get fleetLocation(): string {
    return this.props.fleetLocation;
  }

  constructor(props: FleetLocationProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: FleetLocationProps,
    id?: UniqueEntityId,
  ): Result<FleetLocationProps> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.fleetLocation, argName: 'fleetLocation' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<FleetLocation>(validator.message);
    }
    const module = new FleetLocation(props, id);
    return Result.OK<FleetLocation>(module);
  }
}

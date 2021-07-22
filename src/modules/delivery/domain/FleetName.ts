import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface FleetNameProps {
  fleetName: string;
}

export class FleetName extends Entity<FleetNameProps> {
  get fleetName(): string {
    return this.props.fleetName;
  }

  constructor(props: FleetNameProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: FleetNameProps,
    id?: UniqueEntityId,
  ): Result<FleetNameProps> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.fleetName, argName: 'fleetName' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<FleetName>(validator.message);
    }
    const module = new FleetName(props, id);
    return Result.OK<FleetName>(module);
  }
}

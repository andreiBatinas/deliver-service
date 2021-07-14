import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface FleetIdProps {
  fleetId?: number;
}

export class FleetId extends Entity<FleetIdProps> {
  get fleetId(): number {
    return this.props.fleetId as number;
  }

  constructor(props: FleetIdProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: FleetIdProps, id?: UniqueEntityId): Result<FleetId> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.fleetId, argName: 'fleetId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<FleetId>(validator.message);
    }

    const fleet = new FleetId(props, id);
    return Result.OK<FleetId>(fleet);
  }
}

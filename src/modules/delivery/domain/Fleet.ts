import { Entity, UniqueEntityId } from '../../../core/domain';
import { Result, Validator } from '../../../core/logic';

interface FleetProps {
  fleetId?: number;
  fleetName: string;
  fleetLocation: string;
  accountId: number;
  fleetCreatedAt: string;
  fleetUpdatedAt: string;
  //modules?: Module[];
}

export class Fleet extends Entity<FleetProps> {
  get fleetId(): number {
    return this.props.fleetId as number;
  }

  // get modules(): Module[] | undefined {
  //   return this.props.modules;
  // }

  get fleetName(): string {
    return this.props.fleetName;
  }

  get fleetLocation(): string {
    return this.props.fleetLocation;
  }

  get accountId(): number {
    return this.props.accountId;
  }

  get fleetUpdatedAt(): string {
    return this.props.fleetUpdatedAt;
  }

  get fleetCreatedAt(): string {
    return this.props.fleetCreatedAt;
  }

  constructor(props: FleetProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: FleetProps, id?: UniqueEntityId): Result<Fleet> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.fleetName, argName: 'fleetName' },
      { arg: props.fleetLocation, argName: 'fleetLocation' },
      { arg: props.accountId, argName: 'accountId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<Fleet>(validator.message);
    }

    const fleet = new Fleet(props, id);
    return Result.OK<Fleet>(fleet);
  }
}

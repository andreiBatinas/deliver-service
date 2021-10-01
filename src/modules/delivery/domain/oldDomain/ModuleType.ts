import {
  Entity,
  UniqueEntityId,
} from '../../../../core/domain';
import {
  Result,
  Validator,
} from '../../../../core/logic';
import { Module } from './Module';

interface ModuleTypeProps {
  moduleTypeId?: string;
  name: string;
  modules?: Module[];
}

export class ModuleType extends Entity<ModuleTypeProps> {
  get moduleTypeId(): string {
    return this.props.moduleTypeId as string;
  }

  get modules(): Module[] | undefined {
    return this.props.modules;
  }

  get name(): string {
    return this.props.name;
  }

  constructor(props: ModuleTypeProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: ModuleTypeProps, id?: UniqueEntityId): Result<ModuleType> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.name, argName: 'name' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<ModuleType>(validator.message);
    }

    const conversation = new ModuleType(props, id);
    return Result.OK<ModuleType>(conversation);
  }
}

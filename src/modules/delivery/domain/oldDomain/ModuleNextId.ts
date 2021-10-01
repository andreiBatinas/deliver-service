import {
  Entity,
  UniqueEntityId,
} from '../../../../core/domain';
import {
  Result,
  Validator,
} from '../../../../core/logic';

interface ModuleNextIdProps {
  nextModuleId: string;
}

export class ModuleNextId extends Entity<ModuleNextIdProps> {
  get nextModuleId(): string {
    return this.props.nextModuleId;
  }

  constructor(props: ModuleNextIdProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: ModuleNextIdProps,
    id?: UniqueEntityId,
  ): Result<ModuleNextIdProps> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.nextModuleId, argName: 'nextModuleId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<ModuleNextId>(validator.message);
    }
    const module = new ModuleNextId(props, id);
    return Result.OK<ModuleNextId>(module);
  }
}

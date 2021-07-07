import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface ModuleIdProps {
  moduleId: string;
}

export class ModuleId extends Entity<ModuleIdProps> {
  get moduleId(): string {
    return this.props.moduleId;
  }

  constructor(props: ModuleIdProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: ModuleIdProps, id?: UniqueEntityId): Result<ModuleIdProps> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.moduleId, argName: 'moduleId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<ModuleId>(validator.message);
    }
    const module = new ModuleId(props, id);
    return Result.OK<ModuleId>(module);
  }
}

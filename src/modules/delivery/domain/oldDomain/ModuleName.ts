import {
  Entity,
  UniqueEntityId,
} from '../../../../core/domain';
import {
  Result,
  Validator,
} from '../../../../core/logic';

interface ModuleNameProps {
  moduleName: string;
}

export class ModuleName extends Entity<ModuleNameProps> {
  get moduleName(): string {
    return this.props.moduleName;
  }

  constructor(props: ModuleNameProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: ModuleNameProps,
    id?: UniqueEntityId,
  ): Result<ModuleNameProps> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.moduleName, argName: 'moduleName' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<ModuleName>(validator.message);
    }
    const module = new ModuleName(props, id);
    return Result.OK<ModuleName>(module);
  }
}

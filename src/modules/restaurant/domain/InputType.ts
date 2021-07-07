import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';
import { Module } from './Module';

interface InputTypeProps {
  inputTypeId?: string;
  name: string;
  modules?: Module[];

}

export class InputType extends Entity<InputTypeProps> {
  get inputTypeId(): string {
    return this.props.inputTypeId as string;
  }

  get name(): string {
    return this.props.name;
  }

  get modules(): Module[] | undefined {
    return this.props.modules;
  }

  constructor(props: InputTypeProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: InputTypeProps,
    id?: UniqueEntityId,
  ): Result<InputType> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.name, argName: 'name' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<InputType>(validator.message);
    }

    const inputType = new InputType(props, id);
    return Result.OK<InputType>(inputType);
  }
}

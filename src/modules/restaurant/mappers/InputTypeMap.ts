import { Mapper } from '../../../core/infrastructure';
import { InputType } from '../domain/InputType';

export class InputTypeMap extends Mapper<InputType> {
  public static toPersistent(inputType: InputType): any {
    return {
      name: inputType.name,
    };
  }

  static toDomain(raw: any): InputType {
    const inputTypeOrError = InputType.New({
      name: raw.name,
    });

    return inputTypeOrError.getValue() as InputType;
  }

  static toDomainFromDb(raw: any): InputType {
    const inputTypeOrError = InputType.New({
      name: raw.name,
      inputTypeId: raw.inputTypeId,
      modules: raw.modules ? undefined : [],
    });

    return inputTypeOrError.getValue() as InputType;
  }

  static toFrontend(raw: InputType): any {
    return {
      input_type_id: raw.inputTypeId,
      name: raw.name,
      modules: raw.modules,
    };
  }
}

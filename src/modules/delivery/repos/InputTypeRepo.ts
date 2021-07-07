import { DB } from '../../../infrastructure/typeorm';
import { InputType } from '../domain/oldDomain/InputType';
import { InputTypeMap } from '../mappers/InputTypeMap';
import { InputTypeUpdateMap } from '../mappers/InputTypeUpdateMap';

export interface IInputTypeRepo {
  findInputTypeByName(name: string): Promise<InputType | null>;
  findInputTypeByInputTypeId(inputTypeId: string): Promise<InputType | null>;
  save(inputType: InputType): Promise<InputType>;
  update(inputType: InputType): Promise<InputType | null>;
  exists(name: string): Promise<boolean>;
}

export class InputTypeRepo implements IInputTypeRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(name: string): Promise<boolean> {
    const inputTypeModel = this.models.InputType;
    const r = await DB.getRepository(inputTypeModel).findOne({ name });
    return !!r === true;
  }

  public async findInputTypeByName(name: string): Promise<InputType | null> {
    const campaignModel = this.models.Campaign;
    const r = await DB.getRepository(campaignModel).findOne({
      where: {
        name,
      },
    });

    if (undefined === r) {
      return null;
    }
    return InputTypeMap.toDomain(r);
  }

  public async save(inputType: InputType): Promise<InputType> {
    const inputTypeModel = this.models.InputType;
    const rawInputType = InputTypeMap.toPersistent(inputType);

    const inputTypeRepo = DB.getRepository(inputTypeModel);
    const c = new inputTypeModel();

    c.name = rawInputType.name;

    const inputTypeResult = await inputTypeRepo.save(c);
    return inputTypeResult;
  }

  public async findInputTypeByInputTypeId(
    inputTypeId: string,
  ): Promise<InputType | null> {
    const inputTypeModel = this.models.InputType;
    const inputType = await DB.getRepository(inputTypeModel).findOne({
      where: {
        inputTypeId,
      },
    });

    if (undefined === inputType) {
      return null;
    }
    return inputType as InputType;
  }

  public async update(inputType: InputType): Promise<InputType | null> {
    const inputTypeModel = this.models.InputType;
    const rawInputType = InputTypeUpdateMap.toPersistent(inputType);

    const criteria = { inputTypeId: rawInputType.inputTypeId };
    const propertiesToUpdate = {
      name: rawInputType.name,
    };
    const result = await DB.getRepository(inputTypeModel).update(
      criteria,
      propertiesToUpdate,
    );
    if (undefined === result) {
      return null;
    }
    return rawInputType;
  }
}

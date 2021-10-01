import { DB } from '../../../../infrastructure/typeorm';
import { ModuleType } from '../../domain/oldDomain/ModuleType';

export interface IModuleTypeRepo {
  findModuleTypeById(moduleTypeId: string): Promise<ModuleType | null>;
}

export class ModuleTypeRepo implements IModuleTypeRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(name: string): Promise<boolean> {
    const moduleTypeModel = this.models.ModuleType;
    const r = await DB.getRepository(moduleTypeModel).findOne({ name });
    return !!r === true;
  }

  public async findModuleTypeById(
    moduleTypeId: string,
  ): Promise<ModuleType | null> {
    const moduleTypeModel = this.models.ModuleType;
    const r = await DB.getRepository(moduleTypeModel).findOne({
      where: {
        moduleTypeId,
      },
    });

    if (undefined === r) {
      return null;
    }
    return r as ModuleType;
  }
}

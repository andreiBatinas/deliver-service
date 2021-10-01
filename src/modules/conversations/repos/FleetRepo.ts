import { DeleteResult } from 'typeorm';
import { DB } from '../../../infrastructure/typeorm';
import { Module } from '../domain/Module';
import { ModuleMap } from '../mappers/ModuleMap';

export interface IFleetRepo {
  findModuleByModuleId(moduleId: string): Promise<Module | null>;
  save(module: Module, conversation: any, moduleType: any): Promise<Module>;
  exists(name: string, conversationId: string): Promise<boolean>;
  findModulesByConversationId(moduleId: string): Promise<Module[]>;
  removeModuleByModuleId(moduleId: string): Promise<boolean>;
  update(module: Module): Promise<Module | null>;
}

export class FleetRepo implements IFleetRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(name: string, conversationId: string): Promise<boolean> {
    const moduleModel = this.models.Module;
    const r = await DB.getRepository(moduleModel).findOne({
      where: { name, conversationId },
    });
    return !!r === true;
  }

  public async save(
    module: Module,
    conversation: any,
    moduleType: any,
  ): Promise<Module> {
    const moduleModel = this.models.Module;

    const rawModule = ModuleMap.toPersistent(module);
    const moduleRepo = DB.getRepository(moduleModel);
    const moduleData = new moduleModel();

    moduleData.conversation = conversation;

    moduleData.name = rawModule.name;
    moduleData.moduleType = moduleType;
    moduleData.nextModuleId = rawModule.nextModuleId;
    moduleData.updatedAt = rawModule.updatedAt;

    const moduleResult = await moduleRepo.save(moduleData);

    return moduleResult;
  }

  public async findModulesByConversationId(
    moduleId: string,
  ): Promise<Module[]> {
    const moduleModel = this.models.Module;
    const r = await DB.getRepository(moduleModel).find({
      where: {
        moduleId,
      },
    });

    const moduleList = r.map((entry: any) => {
      return ModuleMap.toDomainFromDb(entry);
    });

    return moduleList;
  }
  public async findModuleByModuleId(moduleId: string): Promise<Module | null> {
    const moduleModel = this.models.Module;
    const module = await DB.getRepository(moduleModel).findOne({
      where: {
        moduleId,
      },
      relations: ['conversation'],
    });

    if (undefined === module) {
      return null;
    }
    return module as Module;
  }

  public async removeModuleByModuleId(moduleId: string): Promise<boolean> {
    const moduleModel = this.models.Module;
    const result: DeleteResult = await DB.getRepository(moduleModel).delete({
      moduleId,
    });

    if (result.affected === 0) {
      return false;
    }
    return true;
  }
  public async update(module: Module): Promise<Module | null> {
    const moduleModel = this.models.Module;

    const result = await DB.getRepository(moduleModel).save(module);
    if (undefined === result) {
      return null;
    }

    return module;
  }
}

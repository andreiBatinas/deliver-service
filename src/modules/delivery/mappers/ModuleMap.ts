import { Mapper } from '../../../core/infrastructure';
import { Module } from '../domain/oldDomain/Module';

export class ModuleMap extends Mapper<Module> {
  public static toPersistent(module: Module): any {
    return {
      id: module.id,
      moduleId: module.moduleId,
      name: module.name,
      prompt: module.prompt,
      moduleType: module.moduleType,
      nextModuleId: module.nextModuleId,
      updatedAt: new Date(),
    };
  }

  static toDomain(raw: any): Module {
    const moduleOrError = Module.New({
      conversation: raw.conversation_id,
      name: raw.module_name,
      prompt: raw.prompt,
      moduleType: raw.module_type,
      nextModuleId: raw.next_module_id,
      updatedAt: raw.updated_at,
    });

    return moduleOrError.getValue() as Module;
  }

  static toDomainFromDb(raw: any): Module {
    const moduleOrError = Module.New({
      moduleId: raw.moduleId,
      conversation: raw.conversationId,
      name: raw.name,
      prompt: raw.prompt,
      moduleType: raw.moduleType,
      nextModuleId: raw.nextModuleId,
      updatedAt: raw.updatedAt,
    });

    return moduleOrError.getValue() as Module;
  }

  static toFrontend(raw: Module): any {
    return {
      module_id: raw.moduleId,
      module_name: raw.name,
      conversation_id: raw.conversation.conversationId,
      prompt: raw.prompt,
      module_type: raw.moduleType,
      next_module_id: raw.nextModuleId,
      updated_at: raw.updatedAt,
    };
  }
}

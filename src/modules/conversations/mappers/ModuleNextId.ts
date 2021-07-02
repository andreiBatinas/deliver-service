import { Mapper } from '../../../core/infrastructure';
import { ModuleNextId } from '../domain/ModuleNextId';

export class ModuleNextIdMap extends Mapper<ModuleNextId> {
  public static toPersistent(module: ModuleNextId): any {
    return {
      nextModuleId: module.nextModuleId,
    };
  }

  public static toBackend(raw: any): any {
    return {
      nextModuleId: raw.next_module_id,
    };
  }

  static toDomain(raw: any): ModuleNextId {
    const conversationOrError = ModuleNextId.New({
      nextModuleId: raw.next_module_id,
    });
    return conversationOrError.getValue() as ModuleNextId;
  }

  static toFrontend(raw: ModuleNextId): any {
    return {
      next_module_id: raw.nextModuleId,
    };
  }
}

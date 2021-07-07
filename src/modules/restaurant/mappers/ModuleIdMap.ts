import { Mapper } from '../../../core/infrastructure';
import { ModuleId } from '../domain/ModuleId';

export class ModuleIdMap extends Mapper<ModuleId> {
  public static toPersistent(module: ModuleId): any {
    return {
      moduleId: module.moduleId,
    };
  }

  static toDomain(raw: any): ModuleId {
    const conversationOrError = ModuleId.New({
      moduleId: raw.module_id,
    });
    return conversationOrError.getValue() as ModuleId;
  }

  static toFrontend(raw: ModuleId): any {
    return {
      module_id: raw.moduleId,
    };
  }
}

import { Mapper } from '../../../core/infrastructure';
import { ModuleName } from '../domain/ModuleName';

export class ModuleNameMap extends Mapper<ModuleName> {
  public static toPersistent(module: ModuleName): any {
    return {
      moduleName: module.moduleName,
    };
  }

  public static toBackend(raw: any): any {
    return {
      moduleName: raw.module_name,
    };
  }

  static toDomain(raw: any): ModuleName {
    const moduleNameOrError = ModuleName.New({
      moduleName: raw.module_name,
    });
    return moduleNameOrError.getValue() as ModuleName;
  }

  static toFrontend(raw: ModuleName): any {
    return {
      module_id: raw.moduleName,
    };
  }
}

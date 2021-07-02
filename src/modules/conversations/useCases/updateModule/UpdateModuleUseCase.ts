import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { ConversationId } from '../../domain/ConversationId';
import { Module } from '../../domain/Module';
import { ModuleId } from '../../domain/ModuleId';
import { ModuleName } from '../../domain/ModuleName';
import { ModuleNextId } from '../../domain/ModuleNextId';
import { ConversationIdMap } from '../../mappers/ConversationIdMap';
import { ModuleIdMap } from '../../mappers/ModuleIdMap';
import { ModuleMap } from '../../mappers/ModuleMap';
import { ModuleNameMap } from '../../mappers/ModuleNameMap';
import { ModuleNextIdMap } from '../../mappers/ModuleNextId';
import { IConversationRepo } from '../../repos/ConversationRepo';
import { IModuleRepo } from '../../repos/ModuleRepo';
import { UpdateModuleDTO } from './UpdateModuleDTO';
import { UpdateModuleErrors } from './UpdateModuleErrors';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class UpdateModuleUseCase implements UseCase<UpdateModuleDTO, Response> {
  private conversationRepo: IConversationRepo;
  private moduleRepo: IModuleRepo;

  constructor(conversationRepo: IConversationRepo, moduleRepo: IModuleRepo) {
    this.conversationRepo = conversationRepo;
    this.moduleRepo = moduleRepo;
  }

  public async execute(req: UpdateModuleDTO): Promise<Response> {
    const log = new Logger('RemoveModuleUseCase');

    const module = ModuleIdMap.toDomain(req);
    const moduleIdOrError = ModuleId.New(module);

    const conversation = ConversationIdMap.toDomain(req);
    const conversationIdOrError = ConversationId.New(conversation);

    const moduleNameMap = ModuleNameMap.toBackend(req);
    const moduleNameOrError = ModuleName.New(moduleNameMap);

    const nextModuleMap = ModuleNextIdMap.toBackend(req);
    const nextModuleIdOrError = ModuleNextId.New(nextModuleMap);

    if (conversationIdOrError.isFailure) {
      return wrong(
        new UpdateModuleErrors.UnknownError(
          conversationIdOrError.error as string,
        ),
      ) as Response;
    }

    if (moduleNameOrError.isFailure && nextModuleIdOrError.isFailure) {
      return wrong(
        new UpdateModuleErrors.UnknownError(
          conversationIdOrError.error as string,
        ),
      ) as Response;
    }

    if (moduleIdOrError.isFailure) {
      return wrong(
        new UpdateModuleErrors.UnknownError(moduleIdOrError.error as string),
      ) as Response;
    }

    if (undefined === moduleIdOrError.getValue()) {
      return wrong(
        new UpdateModuleErrors.UnknownError(moduleIdOrError.error as string),
      ) as Response;
    }

    const moduleId = moduleIdOrError.getValue() as ModuleId;
    const conversationId = conversationIdOrError.getValue() as ConversationId;

    try {
      const persistentModule = (await this.moduleRepo.findModuleByModuleId(
        moduleId.moduleId,
      )) as Module;

      if (persistentModule === null) {
        return wrong(
          new UpdateModuleErrors.UnknownError(moduleId.moduleId),
        ) as Response;
      }

      if (
        persistentModule.conversation.conversationId !==
        conversationId.conversationId
      ) {
        return wrong(
          new UpdateModuleErrors.UnknownError(moduleId.moduleId),
        ) as Response;
      }

      const updatedModule = ModuleMap.toPersistent(persistentModule);
      if (moduleNameOrError.isSuccess) {
        const moduleName = moduleNameOrError.getValue() as ModuleName;
        updatedModule.name = moduleName.moduleName;
      }

      if (nextModuleIdOrError.isSuccess) {
        const nextModuleId = nextModuleIdOrError.getValue() as ModuleNextId;
        updatedModule.nextModuleId = nextModuleId.nextModuleId;
      }

      const response = await this.moduleRepo.update(updatedModule);

      if (response === null) {
        return wrong(
          new UpdateModuleErrors.UnknownError(persistentModule.moduleId),
        ) as Response;
      }
      const result = {
        result: 'ok',
        data: {},
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new UpdateModuleErrors.UnknownError(e)) as Response;
    }
  }
}

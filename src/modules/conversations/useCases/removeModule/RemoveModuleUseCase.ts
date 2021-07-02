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
import { ConversationIdMap } from '../../mappers/ConversationIdMap';
import { ModuleIdMap } from '../../mappers/ModuleIdMap';
import { IConversationRepo } from '../../repos/ConversationRepo';
import { IModuleRepo } from '../../repos/ModuleRepo';
import { RemoveModuleDTO } from './RemoveModuleDTO';
import { RemoveModuleErrors } from './RemoveModuleErrors';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class RemoveModuleUseCase implements UseCase<RemoveModuleDTO, Response> {
  private conversationRepo: IConversationRepo;
  private moduleRepo: IModuleRepo;

  constructor(conversationRepo: IConversationRepo, moduleRepo: IModuleRepo) {
    this.conversationRepo = conversationRepo;
    this.moduleRepo = moduleRepo;
  }

  public async execute(req: RemoveModuleDTO): Promise<Response> {
    const log = new Logger('RemoveModuleUseCase');

    const module = ModuleIdMap.toDomain(req);
    const moduleIdOrError = ModuleId.New(module);

    const c = ConversationIdMap.toDomain(req);
    const conversationIdOrError = ConversationId.New(c);

    if (conversationIdOrError.isFailure) {
      return wrong(
        new RemoveModuleErrors.UnknownError(
          conversationIdOrError.error as string,
        ),
      ) as Response;
    }

    if (moduleIdOrError.isFailure) {
      return wrong(
        new RemoveModuleErrors.UnknownError(moduleIdOrError.error as string),
      ) as Response;
    }

    if (undefined === moduleIdOrError.getValue()) {
      return wrong(
        new RemoveModuleErrors.UnknownError(moduleIdOrError.error as string),
      ) as Response;
    }

    const moduleId = moduleIdOrError.getValue() as ModuleId;
    const conversationId = conversationIdOrError.getValue() as ConversationId;

    try {
      const persistantModule = (await this.moduleRepo.findModuleByModuleId(
        moduleId.moduleId,
      )) as Module;

      if (persistantModule === null) {
        return wrong(
          new RemoveModuleErrors.UnknownError(moduleId.moduleId),
        ) as Response;
      }

      if (
        persistantModule.conversation.conversationId !==
        conversationId.conversationId
      ) {
        return wrong(
          new RemoveModuleErrors.UnknownError(moduleId.moduleId),
        ) as Response;
      }
      const response = await this.moduleRepo.removeModuleByModuleId(
        persistantModule.moduleId,
      );

      if (response === false) {
        return wrong(
          new RemoveModuleErrors.UnknownError(c.conversationId),
        ) as Response;
      }
      const result = {
        result: 'ok',
        data: {},
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new RemoveModuleErrors.UnknownError(e)) as Response;
    }
  }
}

import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { ConversationId } from '../../domain/ConversationId';
import { Module } from '../../domain/Module';
import { ConversationIdMap } from '../../mappers/ConversationIdMap';
import { ModuleMap } from '../../mappers/ModuleMap';
import { IConversationRepo } from '../../repos/ConversationRepo';
import { IModuleRepo } from '../../repos/ModuleRepo';
import { IModuleTypeRepo } from '../../repos/ModuleTypeRepo';
import { AddModuleDTO } from './AddModuleDTO';
import { AddModuleErrors } from './AddModuleErrors';
import { AddModuleResponse } from './AddModuleResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class AddModuleUseCase implements UseCase<AddModuleDTO, Response> {
  private moduleRepo: IModuleRepo;
  private conversationRepo: IConversationRepo;
  private moduleTypeRepo: IModuleTypeRepo;

  constructor(
    moduleRepo: IModuleRepo,
    conversationRepo: IConversationRepo,
    moduleTypeRepo: IModuleTypeRepo,
  ) {
    this.moduleRepo = moduleRepo;
    this.conversationRepo = conversationRepo;
    this.moduleTypeRepo = moduleTypeRepo;
  }

  public async execute(req: AddModuleDTO): Promise<Response> {
    const log = new Logger('AddModuleUseCase');
    const moduleMap = ModuleMap.toDomain(req);
    const moduleOrError = Module.New(moduleMap);

    const conversationIdMap = ConversationIdMap.toDomain(req);
    const conversationIdOrError = ConversationId.New(conversationIdMap);

    if (moduleOrError.isFailure) {
      return wrong(
        new AddModuleErrors.UnknownError(moduleOrError.error as string),
      ) as Response;
    }

    if (conversationIdOrError.isFailure) {
      return wrong(
        new AddModuleErrors.UnknownError(conversationIdOrError.error as string),
      ) as Response;
    }

    const module = moduleOrError.getValue() as Module;
    const conversationId = conversationIdOrError.getValue() as ConversationId;

    try {
      const persistentConversation =
        await this.conversationRepo.findConversationByConversationId(
          conversationId.conversationId,
        );
      if (persistentConversation === null) {
        return wrong(
          new AddModuleErrors.UnknownError("conversation doesn't exist"),
        ) as Response;
      }

      if (persistentConversation.campaignId !== conversationId.campaignId) {
        return wrong(
          new AddModuleErrors.UnknownError("campaign id  doesn't match"),
        ) as Response;
      }

      const persistentModuleType = await this.moduleTypeRepo.findModuleTypeById(
        module.moduleType,
      );
      if (persistentModuleType === null) {
        return wrong(
          new AddModuleErrors.UnknownError("module type doesn't exist"),
        ) as Response;
      }

      const existArray = persistentConversation.modules?.filter(
        (m: Module) => m.name === module.name,
      );
      if (existArray?.length !== 0) {
        return wrong(new AddModuleErrors.ModuleExists(module.name)) as Response;
      }

      const r = await this.moduleRepo.save(
        module,
        persistentConversation,
        persistentModuleType,
      );

      const result: AddModuleResponse = {
        result: 'ok',
        data: ModuleMap.toFrontend(r),
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new AddModuleErrors.UnknownError(e)) as Response;
    }
  }
}

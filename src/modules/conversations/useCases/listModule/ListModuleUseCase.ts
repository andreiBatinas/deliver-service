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
import { ConversationIdMap } from '../../mappers/ConversationIdMap';
import { IConversationRepo } from '../../repos/ConversationRepo';
import { ListModuleDTO } from './ListModuleDTO';
import { ListModuleErrors } from './ListModuleErrors';
import { ListModuleResponse } from './ListModuleResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class ListModuleUseCase implements UseCase<ListModuleDTO, Response> {
  private conversationRepo: IConversationRepo;

  constructor(conversationRepo: IConversationRepo) {
    this.conversationRepo = conversationRepo;
  }

  public async execute(req: ListModuleDTO): Promise<Response> {
    const log = new Logger('ListConversationUseCase');

    const c = ConversationIdMap.toDomain(req);
    const conversationIdOrError = ConversationId.New(c);

    if (conversationIdOrError.isFailure) {
      return wrong(
        new ListModuleErrors.UnknownError(
          conversationIdOrError.error as string,
        ),
      ) as Response;
    }
    const conversation = conversationIdOrError.getValue() as ConversationId;

    try {
      const r = await this.conversationRepo.findConversationByConversationId(
        conversation.conversationId,
      );

      if (r === null) {
        return wrong(
          new ListModuleErrors.UnknownError(conversation.conversationId),
        ) as Response;
      }

      if (r.modules === undefined) {
        return wrong(
          new ListModuleErrors.UnknownError(conversation.conversationId),
        ) as Response;
      }
      const result: ListModuleResponse = {
        result: 'ok',
        data: r.modules,
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new ListModuleErrors.UnknownError(e)) as Response;
    }
  }
}

import { conversationRepo } from '../../../repos';
import { ListConversationController } from './ListConversationController';
import { ListConversationUseCase } from './ListConversationUseCase';

const listConversationUseCase = new ListConversationUseCase(conversationRepo);

export { listConversationUseCase, ListConversationController };

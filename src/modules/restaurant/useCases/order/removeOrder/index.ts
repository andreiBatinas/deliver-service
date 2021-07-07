import { conversationRepo } from '../../../repos';
import { RemoveConversationController } from './RemoveConversationController';
import { RemoveConversationUseCase } from './RemoveConversationUseCase';

const removeConversationUseCase = new RemoveConversationUseCase(conversationRepo);

export { removeConversationUseCase, RemoveConversationController };

import { conversationRepo } from '../../repos';
import { UpdateConversationController } from './UpdateConversationController';
import { UpdateConversationUseCase } from './UpdateConversationUseCase';

const updateConversationUseCase = new UpdateConversationUseCase(
  conversationRepo,
);

export { updateConversationUseCase, UpdateConversationController };

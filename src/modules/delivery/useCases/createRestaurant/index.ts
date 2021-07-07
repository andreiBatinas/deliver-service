import { conversationRepo } from '../../repos';
import { CreateConversationController } from './CreateConversationController';
import { CreateConversationUseCase } from './CreateConversationUseCase';

const createConversationUseCase = new CreateConversationUseCase(conversationRepo);

export { createConversationUseCase, CreateConversationController };

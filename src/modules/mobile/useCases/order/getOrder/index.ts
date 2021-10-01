import { conversationRepo } from '../../../repos';
import { GetConversationController } from './GetConversationController';
import { GetConversationUseCase } from './GetConversationUseCase';


const getConversationUseCase = new GetConversationUseCase(conversationRepo);

export { getConversationUseCase, GetConversationController };

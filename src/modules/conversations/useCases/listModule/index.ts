import { conversationRepo } from '../../repos';
import { ListModuleController } from './ListModuleController';
import { ListModuleUseCase } from './ListModuleUseCase';

const listModuleUseCase = new ListModuleUseCase(conversationRepo);

export { listModuleUseCase, ListModuleController };

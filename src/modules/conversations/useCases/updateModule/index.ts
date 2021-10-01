import {
  conversationRepo,
  moduleRepo,
} from '../../repos';
import { UpdateModuleController } from './UpdateModuleController';
import { UpdateModuleUseCase } from './UpdateModuleUseCase';

const updateModuleUseCase = new UpdateModuleUseCase(
  conversationRepo,
  moduleRepo,
);

export { updateModuleUseCase, UpdateModuleController };

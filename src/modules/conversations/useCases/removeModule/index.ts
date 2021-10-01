import {
  conversationRepo,
  moduleRepo,
} from '../../repos';
import { RemoveModuleController } from './RemoveModuleController';
import { RemoveModuleUseCase } from './RemoveModuleUseCase';

const removeModuleUseCase = new RemoveModuleUseCase(
  conversationRepo,
  moduleRepo,
);

export { removeModuleUseCase, RemoveModuleController };

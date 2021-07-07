import {
  conversationRepo,
  moduleRepo,
  moduleTypeRepo,
} from '../../repos';
import { AddModuleController } from './AddModuleController';
import { AddModuleUseCase } from './AddModuleUseCase';

const addModuleUseCase = new AddModuleUseCase(
  moduleRepo,
  conversationRepo,
  moduleTypeRepo,
);

export { addModuleUseCase, AddModuleController };

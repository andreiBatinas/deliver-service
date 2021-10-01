import { inputTypeRepo } from '../../../repos';
import { AddInputTypeController } from './AddInputTypeController';
import { AddInputTypeUseCase } from './AddInputTypeUseCase';

const addInputTypeUseCase = new AddInputTypeUseCase(inputTypeRepo);

export { addInputTypeUseCase, AddInputTypeController };

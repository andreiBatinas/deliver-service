import { inputTypeRepo } from '../../repos';
import { UpdateInputTypeController } from './UpdateInputTypeController';
import { UpdateInputTypeUseCase } from './UpdateInputTypeUseCase';

const updateInputTypeUseCase = new UpdateInputTypeUseCase(inputTypeRepo);

export { updateInputTypeUseCase, UpdateInputTypeController };

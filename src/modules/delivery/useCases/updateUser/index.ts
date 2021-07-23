import { userRepo } from '../../repos';
import { UpdateUserController } from './UpdateUserController';
import { UpdateUserUseCase } from './UpdateUserUseCase';

const updateUserUseCase = new UpdateUserUseCase(userRepo);

export { updateUserUseCase, UpdateUserController };

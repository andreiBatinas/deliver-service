import { userRepo } from '../../repos';
import { RemoveUserController } from './RemoveUserController';
import { RemoveUserUseCase } from './RemoveUserUseCase';

const removeUserUseCase = new RemoveUserUseCase(userRepo);

export { removeUserUseCase, RemoveUserController };

import { userRepo } from '../../repos';
import { AddUserController } from './AddUserController';
import { AddUserUseCase } from './AddUserUseCase';

const addUserUseCase = new AddUserUseCase(userRepo);

export { addUserUseCase, AddUserController };

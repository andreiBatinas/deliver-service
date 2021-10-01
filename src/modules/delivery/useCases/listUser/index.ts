import { userRepo } from '../../repos';
import { ListUserController } from './ListUserController';
import { ListUserUseCase } from './ListUserUseCase';

const listUserUseCase = new ListUserUseCase(userRepo);

export { listUserUseCase, ListUserController };

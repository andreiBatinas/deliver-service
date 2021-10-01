import { userRepo } from '../../repos';
import { GetUserController } from './GetUserController';
import { GetUserUseCase } from './GetUserUseCase';

const getUserUseCase = new GetUserUseCase(userRepo);

export { getUserUseCase, GetUserController };

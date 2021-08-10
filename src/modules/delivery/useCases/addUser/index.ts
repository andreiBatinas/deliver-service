import {
  fleetRepo,
  userRepo,
} from '../../repos';
import { AddUserController } from './AddUserController';
import { AddUserUseCase } from './AddUserUseCase';

const addUserUseCase = new AddUserUseCase(userRepo, fleetRepo);

export { addUserUseCase, AddUserController };

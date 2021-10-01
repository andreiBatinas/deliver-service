
import { accountRepo } from '../../repos';
import { CreateAccountController } from './CreateAccountController';
import { CreateAccountUseCase } from './CreateAccountUseCase';

const createAccountUseCase = new CreateAccountUseCase(accountRepo);

export { createAccountUseCase, CreateAccountController };

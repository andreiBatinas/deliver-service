import { accountRepo } from '../../repos';
import { AuthenticateAccountController } from './AuthenticateAccountController';
import { AuthenticateAccountUseCase } from './AuthenticateAccountUseCase';

const authenticateAccountUseCase = new AuthenticateAccountUseCase(accountRepo);

export { authenticateAccountUseCase, AuthenticateAccountController };

import { orderRepo } from '../../repos';
import { AddOrderController } from './AddOrderController';
import { AddOrderUseCase } from './AddOrderUseCase';

const addOrderUseCase = new AddOrderUseCase(orderRepo);

export { addOrderUseCase, AddOrderController };

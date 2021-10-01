import { orderRepo } from '../../repos';
import { RemoveOrderController } from './RemoveOrderController';
import { RemoveOrderUseCase } from './RemoveOrderUseCase';

const removeOrderUseCase = new RemoveOrderUseCase(orderRepo);

export { removeOrderUseCase, RemoveOrderController };

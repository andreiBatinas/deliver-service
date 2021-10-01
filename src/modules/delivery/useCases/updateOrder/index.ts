import { orderRepo } from '../../repos';
import { UpdateOrderController } from './UpdateOrderController';
import { UpdateOrderUseCase } from './UpdateOrderUseCase';

const updateOrderUseCase = new UpdateOrderUseCase(orderRepo);

export { updateOrderUseCase, UpdateOrderController };

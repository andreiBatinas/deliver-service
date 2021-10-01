import { orderRepo } from '../../repos';
import { GetOrderController } from './GetOrderController';
import { GetOrderUseCase } from './GetOrderUseCase';

const getOrderUseCase = new GetOrderUseCase(orderRepo);

export { getOrderUseCase, GetOrderController };

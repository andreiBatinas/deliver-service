import { orderRepo } from '../../repos';
import { ListOrderController } from './ListOrderController';
import { ListOrderUseCase } from './ListOrderUseCase';

const listOrderUseCase = new ListOrderUseCase(orderRepo);

export { listOrderUseCase, ListOrderController };

import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { Order } from '../../domain/Order';
import { OrderId } from '../../domain/OrderId';
import { OrderMap } from '../../mappers/OrderMap';
import { IOrderRepo } from '../../repos/OrderRepo';
import { UpdateOrderDTO } from './UpdateOrderDTO';
import { UpdateOrderErrors } from './UpdateOrderErrors';
import { UpdateOrderResponse } from './UpdateOrderResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class UpdateOrderUseCase implements UseCase<UpdateOrderDTO, Response> {
  private orderRepo: IOrderRepo;

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo;
  }
  public async execute(req: UpdateOrderDTO): Promise<Response> {
    const log = new Logger('UpdateOrderUseCase');

    const o = OrderMap.toBackend(req.order);
    const orderIdOrError = OrderId.New(o);

    if (orderIdOrError.isFailure) {
      return wrong(Result.Fail<OrderId>(orderIdOrError.error)) as Response;
    }
    try {
      const order = o as Order;
      const checkOrder = (await this.orderRepo.findOrderByOrderId(
        order.orderId,
      )) as Order;

      if (checkOrder === null) {
        return wrong(
          new UpdateOrderErrors.OrderDoesntExists(`${order.orderId}`),
        ) as Response;
      }

      const r = await this.orderRepo.updateOrder(order);

      if (r === null) {
        return wrong(
          new UpdateOrderErrors.UnknownError(`${order.orderId}`),
        ) as Response;
      }

      const result: UpdateOrderResponse = {
        result: 'order updated',
        data: OrderMap.toFrontend(r),
      };

      return right(Result.OK<UpdateOrderResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new UpdateOrderErrors.UnknownError(e)) as Response;
    }
  }
}

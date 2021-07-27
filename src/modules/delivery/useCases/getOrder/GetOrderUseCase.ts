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
import { OrderIdMap } from '../../mappers/OrderIdMap';
import { OrderMap } from '../../mappers/OrderMap';
import { IOrderRepo } from '../../repos/OrderRepo';
import { GetOrderDTO } from './GetOrderDTO';
import { GetOrderErrors } from './GetOrderErrors';
import { GetOrderResponse } from './GetOrderResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class GetOrderUseCase implements UseCase<GetOrderDTO, Response> {
  private orderRepo: IOrderRepo;

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo;
  }

  public async execute(req: GetOrderDTO): Promise<Response> {
    const log = new Logger('GetOrderUseCase');

    const o = OrderIdMap.toBackend(req.order);
    const orderOrError = OrderId.New(o);

    if (orderOrError.isFailure) {
      return wrong(Result.Fail<OrderId>(orderOrError.error)) as Response;
    }

    try {
      const order = orderOrError.getValue() as OrderId;
      const persistantOrder = (await this.orderRepo.findOrderByOrderId(
        order.orderId,
      )) as Order;

      if (persistantOrder === null) {
        return wrong(
          new GetOrderErrors.OrderNotFound(`${order.orderId}`),
        ) as Response;
      }

      const result: GetOrderResponse = {
        result: 'order found',
        data: OrderMap.toFrontend(persistantOrder),
      };

      return right(Result.OK<GetOrderResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new GetOrderErrors.UnknownError(e)) as Response;
    }
  }
}

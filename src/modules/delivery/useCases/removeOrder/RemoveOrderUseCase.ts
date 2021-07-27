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
import { IOrderRepo } from '../../repos/OrderRepo';
import { RemoveOrderDTO } from './RemoveOrderDTO';
import { RemoveOrderErrors } from './RemoveOrderErrors';
import { RemoveOrderResponse } from './RemoveOrderResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class RemoveOrderUseCase implements UseCase<RemoveOrderDTO, Response> {
  private orderRepo: IOrderRepo;

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo;
  }

  public async execute(req: RemoveOrderDTO): Promise<Response> {
    const log = new Logger('RemovOrderUseCase');

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
          new RemoveOrderErrors.OrderNotFound(`${order.orderId}`),
        ) as Response;
      }

      const r = await this.orderRepo.removeOrderByOrderId(
        persistantOrder.orderId,
      );

      const result: RemoveOrderResponse = {
        result: 'order remove',
        data: OrderIdMap.toFrontend(r),
      };

      return right(Result.OK<RemoveOrderResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new RemoveOrderErrors.UnknownError(e)) as Response;
    }
  }
}

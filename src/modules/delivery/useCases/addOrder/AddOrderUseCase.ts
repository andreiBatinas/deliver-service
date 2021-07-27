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
import { OrderMap } from '../../mappers/OrderMap';
import { IOrderRepo } from '../../repos/OrderRepo';
import { AddOrderDTO } from './AddOrderDTO';
import { AddOrderErrors } from './AddOrderErrors';
import { AddOrderResponse } from './AddOrderResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class AddOrderUseCase implements UseCase<AddOrderDTO, Response> {
  private orderRepo: IOrderRepo;

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo;
  }

  public async execute(req: AddOrderDTO): Promise<Response> {
    const log = new Logger('AddOrderUseCase');

    const o = OrderMap.toBackend(req.order);
    const orderOrError = Order.New(o);

    if (orderOrError.isFailure) {
      return wrong(Result.Fail<Order>(orderOrError.error)) as Response;
    }

    try {
      const order = orderOrError.getValue() as Order;
      const exist = await this.orderRepo.exists(order.orderNumber);

      if (exist) {
        return wrong(
          new AddOrderErrors.OrderExists(order.orderNumber),
        ) as Response;
      }
      const r = await this.orderRepo.save(order);

      const result: AddOrderResponse = {
        result: 'order added',
        data: OrderMap.toFrontend(r),
      };

      return right(Result.OK<AddOrderResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new AddOrderErrors.UnknownError(e)) as Response;
    }
  }
}

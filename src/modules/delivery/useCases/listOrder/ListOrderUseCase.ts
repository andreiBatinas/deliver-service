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
import { RestaurantId } from '../../domain/RestaurantId';
import { OrderMap } from '../../mappers/OrderMap';
import { RestaurantIdMap } from '../../mappers/RestaurantIdMap';
import { IOrderRepo } from '../../repos/OrderRepo';
import { ListOrderDTO } from './ListOrderDTO';
import { ListOrderErrors } from './ListOrderErrors';
import { ListOrderResponse } from './ListOrderResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class ListOrderUseCase implements UseCase<ListOrderDTO, Response> {
  private orderRepo: IOrderRepo;

  constructor(orderRepo: IOrderRepo) {
    this.orderRepo = orderRepo;
  }

  public async execute(req: ListOrderDTO): Promise<Response> {
    const log = new Logger('ListOrderUseCase');

    const rest = RestaurantIdMap.toBackend(req.order);
    const restaurantIdOrError = RestaurantId.New(rest);

    if (restaurantIdOrError.isFailure) {
      return wrong(
        Result.Fail<RestaurantId>(restaurantIdOrError.error),
      ) as Response;
    }

    try {
      const restaurant = restaurantIdOrError.getValue() as RestaurantId;
      const listOrder = (await this.orderRepo.findOrdersByRestaurantId(
        restaurant.restaurantId,
      )) as Order[];

      if (listOrder === null) {
        return wrong(
          new ListOrderErrors.OrdersNotFound(`${restaurant.restaurantId}`),
        ) as Response;
      }

      const resultList = listOrder.map((entry: any) => {
        return OrderMap.toFrontend(entry);
      });

      const result: ListOrderResponse = {
        result: 'order list',
        data: resultList,
      };

      return right(Result.OK<ListOrderResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new ListOrderErrors.UnknownError(e)) as Response;
    }
  }
}

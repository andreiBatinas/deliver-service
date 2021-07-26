import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { Restaurant } from '../../domain/Restaurant';
import { RestaurantId } from '../../domain/RestaurantId';
import { RestaurantIdMap } from '../../mappers/RestaurantIdMap';
import { RestaurantMap } from '../../mappers/RestaurantMap';
import { IRestaurantRepo } from '../../repos/RestaurantRepo';
import { GetRestaurantDTO } from './GetRestaurantDTO';
import { GetRestaurantErrors } from './GetRestaurantErrors';
import { GetRestaurantResponse } from './GetRestaurantResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class GetRestaurantUseCase
  implements UseCase<GetRestaurantDTO, Response>
{
  private restaurantRepo: IRestaurantRepo;

  constructor(restaurantRepo: IRestaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  public async execute(req: GetRestaurantDTO): Promise<Response> {
    const log = new Logger('GetRestaurantUseCase');

    const rest = RestaurantIdMap.toBackend(req.restaurant);
    const restaurantOrError = RestaurantId.New(rest);

    if (restaurantOrError.isFailure) {
      return wrong(
        Result.Fail<RestaurantId>(restaurantOrError.error),
      ) as Response;
    }

    try {
      const restaurant = restaurantOrError.getValue() as RestaurantId;
      const persistantRestaurant =
        (await this.restaurantRepo.findRestaurantByRestaurantId(
          restaurant.restaurantId,
        )) as Restaurant;

      if (persistantRestaurant === null) {
        return wrong(
          new GetRestaurantErrors.RestaurantNotFound(
            `${restaurant.restaurantId}`,
          ),
        ) as Response;
      }

      const result: GetRestaurantResponse = {
        result: 'restaurant found',
        data: RestaurantMap.toFrontend(persistantRestaurant),
      };

      return right(Result.OK<GetRestaurantResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new GetRestaurantErrors.UnknownError(e)) as Response;
    }
  }
}

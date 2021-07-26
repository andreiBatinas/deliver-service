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
import { IRestaurantRepo } from '../../repos/RestaurantRepo';
import { RemoveRestaurantDTO } from './RemoveRestaurantDTO';
import { RemoveRestaurantErrors } from './RemoveRestaurantErrors';
import { RemoveRestaurantResponse } from './RemoveRestaurantResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class RemoveRestaurantUseCase
  implements UseCase<RemoveRestaurantDTO, Response>
{
  private restaurantRepo: IRestaurantRepo;

  constructor(restaurantRepo: IRestaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  public async execute(req: RemoveRestaurantDTO): Promise<Response> {
    const log = new Logger('RemoveRestaurantUseCase');

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
          new RemoveRestaurantErrors.RestaurantNotFound(
            `${restaurant.restaurantId}`,
          ),
        ) as Response;
      }

      const r = await this.restaurantRepo.removeRestaurantByRestaurantId(
        persistantRestaurant.restaurantId,
      );

      const result: RemoveRestaurantResponse = {
        result: 'restaurant remove',
        data: RestaurantIdMap.toFrontend(r),
      };

      return right(Result.OK<RemoveRestaurantResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new RemoveRestaurantErrors.UnknownError(e)) as Response;
    }
  }
}

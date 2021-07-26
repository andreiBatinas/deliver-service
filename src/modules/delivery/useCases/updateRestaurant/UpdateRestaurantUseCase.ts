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
import { RestaurantMap } from '../../mappers/RestaurantMap';
import { IRestaurantRepo } from '../../repos/RestaurantRepo';
import { UpdateRestaurantDTO } from './UpdateRestaurantDTO';
import { UpdateRestaurantErrors } from './UpdateRestaurantErrors';
import { UpdateRestaurantResponse } from './UpdateRestaurantResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class UpdateRestaurantUseCase
  implements UseCase<UpdateRestaurantDTO, Response>
{
  private restaurantRepo: IRestaurantRepo;

  constructor(restaurantRepo: IRestaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }
  public async execute(req: UpdateRestaurantDTO): Promise<Response> {
    const log = new Logger('UpdateRestaurantUseCase');

    const rest = RestaurantMap.toBackend(req.restaurant);
    const restaurantIdOrError = RestaurantId.New(rest);

    if (restaurantIdOrError.isFailure) {
      return wrong(
        Result.Fail<Restaurant>(restaurantIdOrError.error),
      ) as Response;
    }
    try {
      const restaurant = rest as Restaurant;
      const checkRestaurant =
        (await this.restaurantRepo.findRestaurantByRestaurantId(
          restaurant.restaurantId,
        )) as Restaurant;

      if (checkRestaurant === null) {
        return wrong(
          new UpdateRestaurantErrors.RestaurantDoesntExists(
            `${restaurant.restaurantId}`,
          ),
        ) as Response;
      }

      const r = await this.restaurantRepo.updateRestaurant(restaurant);

      if (r === null) {
        return wrong(
          new UpdateRestaurantErrors.UnknownError(`${restaurant.restaurantId}`),
        ) as Response;
      }

      const result: UpdateRestaurantResponse = {
        result: 'restaurant updated',
        data: RestaurantMap.toFrontend(r),
      };

      return right(Result.OK<UpdateRestaurantResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new UpdateRestaurantErrors.UnknownError(e)) as Response;
    }
  }
}

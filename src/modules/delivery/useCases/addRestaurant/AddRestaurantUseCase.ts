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
import { RestaurantMap } from '../../mappers/RestaurantMap';
import { IRestaurantRepo } from '../../repos/RestaurantRepo';
import { AddRestaurantDTO } from './AddRestaurantDTO';
import { AddRestaurantErrors } from './AddRestaurantErrors';
import { AddRestaurantResponse } from './AddRestaurantResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class AddRestaurantUseCase
  implements UseCase<AddRestaurantDTO, Response>
{
  private restaurantRepo: IRestaurantRepo;

  constructor(restaurantRepo: IRestaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  public async execute(req: AddRestaurantDTO): Promise<Response> {
    const log = new Logger('AddRestaurantUseCase');

    const rest = RestaurantMap.toBackend(req.restaurant);
    const restaurantOrError = Restaurant.New(rest);

    if (restaurantOrError.isFailure) {
      return wrong(
        Result.Fail<Restaurant>(restaurantOrError.error),
      ) as Response;
    }

    try {
      const restaurant = restaurantOrError.getValue() as Restaurant;
      const exist = await this.restaurantRepo.exists(restaurant.restaurantName);

      if (exist) {
        return wrong(
          new AddRestaurantErrors.RestaurantExists(restaurant.restaurantName),
        ) as Response;
      }
      const r = await this.restaurantRepo.save(restaurant);

      const result: AddRestaurantResponse = {
        result: 'restaurant added',
        data: RestaurantMap.toFrontend(r),
      };

      return right(Result.OK<AddRestaurantResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new AddRestaurantErrors.UnknownError(e)) as Response;
    }
  }
}

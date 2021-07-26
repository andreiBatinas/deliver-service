import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { FleetId } from '../../domain/FleetId';
import { Restaurant } from '../../domain/Restaurant';
import { FleetIdMap } from '../../mappers/FleetIdMap';
import { RestaurantMap } from '../../mappers/RestaurantMap';
import { IRestaurantRepo } from '../../repos/RestaurantRepo';
import { ListRestaurantDTO } from './ListRestaurantDTO';
import { ListRestaurantErrors } from './ListRestaurantErrors';
import { ListRestaurantResponse } from './ListRestaurantResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class ListRestaurantUseCase
  implements UseCase<ListRestaurantDTO, Response>
{
  private restaurantRepo: IRestaurantRepo;

  constructor(restaurantRepo: IRestaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  public async execute(req: ListRestaurantDTO): Promise<Response> {
    const log = new Logger('ListRestaurantUseCase');

    const f = FleetIdMap.toBackend(req.restaurant);
    const fleetIdOrError = FleetId.New(f);

    if (fleetIdOrError.isFailure) {
      return wrong(Result.Fail<FleetId>(fleetIdOrError.error)) as Response;
    }

    try {
      const fleet = fleetIdOrError.getValue() as FleetId;
      const listRestaurant =
        (await this.restaurantRepo.findRestaurantsByFleetId(
          fleet.fleetId,
        )) as Restaurant[];

      if (listRestaurant === null) {
        return wrong(
          new ListRestaurantErrors.RestaurantsNotFound(`${fleet.fleetId}`),
        ) as Response;
      }

      const resultList = listRestaurant.map((entry: any) => {
        return RestaurantMap.toFrontend(entry);
      });

      const result: ListRestaurantResponse = {
        result: 'restaurant list',
        data: resultList,
      };

      return right(Result.OK<ListRestaurantResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new ListRestaurantErrors.UnknownError(e)) as Response;
    }
  }
}

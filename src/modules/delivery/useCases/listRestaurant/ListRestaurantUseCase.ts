import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { AccountId } from '../../domain/AccountId';
import { FleetId } from '../../domain/FleetId';
import { Restaurant } from '../../domain/Restaurant';
import { AccountIdMap } from '../../mappers/AccountIdMap';
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

    const a = AccountIdMap.toBackend(req.restaurantToList);
    const accountIdOrError = AccountId.New(a);

    if (accountIdOrError.isFailure) {
      return wrong(Result.Fail<FleetId>(accountIdOrError.error)) as Response;
    }

    // const f = FleetIdMap.toBackend(req.restaurant);
    // const fleetIdOrError = FleetId.New(f);

    // if (fleetIdOrError.isFailure) {
    //   return wrong(Result.Fail<FleetId>(fleetIdOrError.error)) as Response;
    // }

    try {
      const account = accountIdOrError.getValue() as AccountId;
      //const fleet = fleetIdOrError.getValue() as FleetId;
      const listRestaurant =
        (await this.restaurantRepo.findRestaurantsByAccountId(
          account.accountId,
        )) as Restaurant[];

      if (listRestaurant === null) {
        return wrong(
          new ListRestaurantErrors.RestaurantsNotFound(`${account.accountId}`),
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
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new ListRestaurantErrors.UnknownError(e)) as Response;
    }
  }
}

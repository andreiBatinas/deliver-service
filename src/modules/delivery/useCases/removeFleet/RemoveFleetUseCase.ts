import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { Fleet } from '../../domain/Fleet';
import { FleetId } from '../../domain/FleetId';
import { FleetIdMap } from '../../mappers/FleetIdMap';
import { IFleetRepo } from '../../repos/FleetRepo';
import { RemoveFleetDTO } from './RemoveFleetDTO';
import { RemoveFleetErrors } from './RemoveFleetErrors';
import { RemoveFleetResponse } from './RemoveFleetResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class RemoveFleetUseCase implements UseCase<RemoveFleetDTO, Response> {
  private fleetRepo: IFleetRepo;

  constructor(fleetRepo: IFleetRepo) {
    this.fleetRepo = fleetRepo;
  }

  public async execute(req: RemoveFleetDTO): Promise<Response> {
    const log = new Logger('RemoveFleetUseCase');

    const f = FleetIdMap.toBackend(req.fleet);
    const fleetOrError = FleetId.New(f);

    if (fleetOrError.isFailure) {
      return wrong(Result.Fail<FleetId>(fleetOrError.error)) as Response;
    }

    try {
      const fleet = fleetOrError.getValue() as FleetId;
      const persistantFleet = (await this.fleetRepo.findFleetByFleetId(
        fleet.fleetId,
      )) as Fleet;

      if (persistantFleet === null) {
        return wrong(
          new RemoveFleetErrors.UnknownError(`${fleet.fleetId}`),
        ) as Response;
      }

      const r = await this.fleetRepo.removeFleetByFleetId(
        persistantFleet.fleetId,
      );

      const result: RemoveFleetResponse = {
        result: 'fleet remove',
        data: FleetIdMap.toFrontend(r),
      };

      return right(Result.OK<RemoveFleetResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new RemoveFleetErrors.UnknownError(e)) as Response;
    }
  }
}

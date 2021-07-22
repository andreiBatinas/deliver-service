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
import { FleetMap } from '../../mappers/FleetMap';
import { IFleetRepo } from '../../repos/FleetRepo';
import { GetFleetDTO } from './GetFleetDTO';
import { GetFleetErrors } from './GetFleetErrors';
import { GetFleetResponse } from './GetFleetResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class GetFleetUseCase implements UseCase<GetFleetDTO, Response> {
  private fleetRepo: IFleetRepo;

  constructor(fleetRepo: IFleetRepo) {
    this.fleetRepo = fleetRepo;
  }

  public async execute(req: GetFleetDTO): Promise<Response> {
    const log = new Logger('GetFleetUseCase');

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
          new GetFleetErrors.UnknownError(`${fleet.fleetId}`),
        ) as Response;
      }

      const result: GetFleetResponse = {
        result: 'fleet found',
        data: FleetMap.toFrontend(persistantFleet),
      };

      return right(Result.OK<GetFleetResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new GetFleetErrors.UnknownError(e)) as Response;
    }
  }
}

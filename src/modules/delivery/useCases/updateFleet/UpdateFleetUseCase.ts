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
import { FleetMap } from '../../mappers/FleetMap';
import { IFleetRepo } from '../../repos/FleetRepo';
import { UpdateFleetDTO } from './UpdateFleetDTO';
import { UpdateFleetErrors } from './UpdateFleetErrors';
import { UpdateFleetResponse } from './UpdateFleetResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class UpdateFleetUseCase implements UseCase<UpdateFleetDTO, Response> {
  private fleetRepo: IFleetRepo;

  constructor(fleetRepo: IFleetRepo) {
    this.fleetRepo = fleetRepo;
  }
  public async execute(req: UpdateFleetDTO): Promise<Response> {
    const log = new Logger('UpdateFleetUseCase');

    const f = FleetMap.toBackend(req.fleet);
    const fleetIdOrError = FleetId.New(f);

    if (fleetIdOrError.isFailure) {
      return wrong(Result.Fail<Fleet>(fleetIdOrError.error)) as Response;
    }
    try {
      const fleet = f as Fleet;
      const checkFleet = (await this.fleetRepo.findFleetByFleetId(
        fleet.fleetId,
      )) as Fleet;

      if (checkFleet === null) {
        return wrong(
          new UpdateFleetErrors.UnknownError(`${fleet.fleetId}`),
        ) as Response;
      }

      const r = await this.fleetRepo.updateFleet(fleet);

      if (r === null) {
        return wrong(
          new UpdateFleetErrors.UnknownError(`${fleet.fleetId}`),
        ) as Response;
      }

      const result: UpdateFleetResponse = {
        result: 'fleet updated',
        data: await FleetMap.toFrontend(r),
      };

      return right(Result.OK<UpdateFleetResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details},${e.message}`, 'error');
      return wrong(new UpdateFleetErrors.UnknownError(e)) as Response;
    }
  }
}

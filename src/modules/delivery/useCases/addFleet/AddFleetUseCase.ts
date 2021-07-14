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
import { FleetMap } from '../../mappers/FleetMap';
import { IFleetRepo } from '../../repos/FleetRepo';
import { AddFleetDTO } from './AddFleetDTO';
import { AddFleetErrors } from './AddFleetErrors';
import { AddFleetResponse } from './AddFleetResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class AddFleetUseCase implements UseCase<AddFleetDTO, Response> {
  private fleetRepo: IFleetRepo;

  constructor(fleetRepo: IFleetRepo) {
    this.fleetRepo = fleetRepo;
  }

  public async execute(req: AddFleetDTO): Promise<Response> {
    const log = new Logger('AddFleetUseCase');

    const c = FleetMap.toBackend(req.fleet);
    const fleetOrError = Fleet.New(c);

    if (fleetOrError.isFailure) {
      return wrong(Result.Fail<Fleet>(fleetOrError.error)) as Response;
    }

    try {
      const fleet = fleetOrError.getValue() as Fleet;
      const exist = await this.fleetRepo.exists(fleet.fleetName);

      if (exist) {
        return wrong(
          new AddFleetErrors.FleetExists(fleet.fleetName),
        ) as Response;
      }
      const r = await this.fleetRepo.save(fleet);

      const result: AddFleetResponse = {
        result: 'fleet added',
        data: FleetMap.toFrontend(r),
      };

      return right(Result.OK<AddFleetResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new AddFleetErrors.UnknownError(e)) as Response;
    }
  }
}

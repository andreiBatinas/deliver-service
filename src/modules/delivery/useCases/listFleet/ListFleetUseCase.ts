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
import { Fleet } from '../../domain/Fleet';
import { FleetId } from '../../domain/FleetId';
import { AccountIdMap } from '../../mappers/AccountIdMap';
import { FleetMap } from '../../mappers/FleetMap';
import { IFleetRepo } from '../../repos/FleetRepo';
import { ListFleetDTO } from './ListFleetDTO';
import { ListFleetErrors } from './ListFleetErrors';
import { ListFleetResponse } from './ListFleetResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class ListFleetUseCase implements UseCase<ListFleetDTO, Response> {
  private fleetRepo: IFleetRepo;

  constructor(fleetRepo: IFleetRepo) {
    this.fleetRepo = fleetRepo;
  }

  public async execute(req: ListFleetDTO): Promise<Response> {
    const log = new Logger('GetFleetUseCase');

    const a = AccountIdMap.toBackend(req.fleet);
    const accountIdOrError = AccountId.New(a);

    if (accountIdOrError.isFailure) {
      return wrong(Result.Fail<FleetId>(accountIdOrError.error)) as Response;
    }

    try {
      const account = accountIdOrError.getValue() as AccountId;
      const listFleet = (await this.fleetRepo.findFleetsByAccountId(
        account.accountId,
      )) as Fleet[];

      if (listFleet === null) {
        return wrong(
          new ListFleetErrors.UnknownError(`${account.accountId}`),
        ) as Response;
      }

      const resultList = listFleet.map((entry: any) => {
        return FleetMap.toFrontend(entry);
      });

      const result: ListFleetResponse = {
        result: 'fleet list',
        data: resultList,
      };

      return right(Result.OK<ListFleetResponse>(result)) as Response;
    } catch (e) {
      log.error(`[HTTP][Error] ${e.details}`, 'error');
      return wrong(new ListFleetErrors.UnknownError(e)) as Response;
    }
  }
}

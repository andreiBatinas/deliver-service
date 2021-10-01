import { UseCase } from '../../../../../domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
} from '../../../../../logic';
import { PingDTO } from './PingDTO';
import { PingResponse } from './PingResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<PingResponse> | Result<any>,
  Result<void>
>;

export class PingUseCase implements UseCase<PingDTO, Response> {
  constructor() {
    //
  }

  public async execute(req: PingDTO): Promise<Response> {
    return right(
      Result.OK<PingResponse>({
        name: process.env.npm_package_name as string,
        version: process.env.npm_package_version as string,
        result: 'OK'
      })
    ) as Response;
  }
}

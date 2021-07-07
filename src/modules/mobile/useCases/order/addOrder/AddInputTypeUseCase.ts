import { UseCase } from '../../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../../core/logic';
import { Logger } from '../../../../../infrastructure/logger';
import { InputType } from '../../../domain/InputType';
import { InputTypeMap } from '../../../mappers/InputTypeMap';
import { IInputTypeRepo } from '../../../repos/InputTypeRepo';
import { AddInputTypeDTO } from './AddInputTypeDTO';
import { AddInputTypeErrors } from './AddInputTypeErrors';
import { AddInputTypeResponse } from './AddInputTypeResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class AddInputTypeUseCase implements UseCase<AddInputTypeDTO, Response> {
  private InputTypeRepo: IInputTypeRepo;

  constructor(InputTypeRepo: IInputTypeRepo) {
    this.InputTypeRepo = InputTypeRepo;
  }

  public async execute(req: AddInputTypeDTO): Promise<Response> {
    const log = new Logger('AddInputTypeUseCase');

    const c = InputTypeMap.toDomain(req);
    const InputTypeOrError = InputType.New(c);

    if (InputTypeOrError.isFailure) {
      return wrong(Result.Fail<InputType>(InputTypeOrError.error)) as Response;
    }

    try {
      const inputType = InputTypeOrError.getValue() as InputType;
      const exist = await this.InputTypeRepo.exists(InputType.name);

      if (exist) {
        return wrong(new AddInputTypeErrors.InputTypeExists(inputType.name)) as Response;
      }
      const r = await this.InputTypeRepo.save(inputType);

      const result: AddInputTypeResponse = {
        result: 'ok',
        data: InputTypeMap.toFrontend(r),
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new AddInputTypeErrors.UnknownError(e)) as Response;
    }
  }
}

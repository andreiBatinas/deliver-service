import { UseCase } from '../../../../core/domain';
import {
  Either,
  GenericErrors,
  Result,
  right,
  wrong,
} from '../../../../core/logic';
import { Logger } from '../../../../infrastructure/logger';
import { InputType } from '../../domain/InputType';
import { InputTypeMap } from '../../mappers/InputTypeMap';
import { InputTypeUpdateMap } from '../../mappers/InputTypeUpdateMap';
import { IInputTypeRepo } from '../../repos/InputTypeRepo';
import { UpdateInputTypeDTO } from '../updateInputType/UpdateInputTypeDTO';
import { UpdateInputTypeErrors } from '../updateInputType/UpdateInputTypeErrors';
import { UpdateInputTypeResponse } from '../updateInputType/UpdateInputTypeResponse';

type Response = Either<
  GenericErrors.UnexpectedError | Result<any>,
  Result<void>
>;

export class UpdateInputTypeUseCase
  implements UseCase<UpdateInputTypeDTO, Response> {
  private InputTypeRepo: IInputTypeRepo;

  constructor(InputTypeRepo: IInputTypeRepo) {
    this.InputTypeRepo = InputTypeRepo;
  }

  public async execute(req: UpdateInputTypeDTO): Promise<Response> {
    const log = new Logger('UpdateInputTypeUseCase');

    const c = InputTypeUpdateMap.toDomain(req);
    const InputTypeOrError = InputType.New(c);

    if (InputTypeOrError.isFailure) {
      return wrong(Result.Fail<InputType>(InputTypeOrError.error)) as Response;
    }

    try {
      const inputType = InputTypeOrError.getValue() as InputType;
      const inputTypeCheck = (await this.InputTypeRepo.findInputTypeByInputTypeId(
        inputType.inputTypeId,
      )) as InputType;

      if (inputTypeCheck == null) {
        return wrong(
          new UpdateInputTypeErrors.InputTypeNotExists(inputType.name),
        ) as Response;
      }
      const r = await this.InputTypeRepo.update(inputType);
      if (r === null) {
        return wrong(
          Result.Fail<InputType>(InputTypeOrError.error),
        ) as Response;
      }
      const result: UpdateInputTypeResponse = {
        result: 'ok',
        data: InputTypeMap.toFrontend(r),
      };

      return right(Result.OK<any>(result)) as Response;
    } catch (e) {
      return wrong(new UpdateInputTypeErrors.UnknownError(e)) as Response;
    }
  }
}

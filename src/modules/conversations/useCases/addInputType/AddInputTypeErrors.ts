/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { Result, UseCaseError } from '../../../../core/logic';
import { sprintf } from '../../../../infrastructure/fmt';

export namespace AddInputTypeErrors {
  export class DataNotFound extends Result<UseCaseError> {
    constructor(token: string) {
      super(false, {
        message: sprintf('Data not found. Got {0}', token),
      } as UseCaseError);
    }
  }

  export class UnknownError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: sprintf('Unknown Error . Got: {0}', id),
      });
    }
  }

  export class InputTypeExists extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: sprintf('Error. Input Type found  Got: {0}', name),
      });
    }
  }
}

import { Result } from './Result';
import { UseCaseError } from './UseCaseError';

// tslint:disable-next-line: no-namespace
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GenericErrors {
  export class UnexpectedError extends Result<UseCaseError> {
    constructor(err: any) {
      super(false, {
        message: 'Unexpected error occurred.',
        error: err
      } as UseCaseError);
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}

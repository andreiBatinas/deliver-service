// eslint-disable-next-line max-classes-per-file
import {
  Result,
  UseCaseError,
} from '../../../../core/logic';
import { sprintf } from '../../../../infrastructure/fmt';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListConversationErrors {
  export class TokenNotFound extends Result<UseCaseError> {
    constructor(token: string) {
      super(false, {
        message: sprintf('Token entry not found. Got {0}', token)
      } as UseCaseError);
    }
  }

  export class UnknownError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: sprintf('Unknown Error . Got: {0}', id)
      });
    }
  }
}

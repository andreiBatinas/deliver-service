/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import {
  Result,
  UseCaseError,
} from '../../../../core/logic';
import { sprintf } from '../../../../infrastructure/fmt';

export namespace AddRestaurantErrors {
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

  export class RestaurantExists extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: sprintf('Error. Module found  Got: {0}', name),
      });
    }
  }

  export class FleetDoesntExists extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: sprintf('Error. Fleet not found. Got {0}', name),
      });
    }
  }
}

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import {
  Result,
  UseCaseError,
} from '../../../../core/logic';
import { sprintf } from '../../../../infrastructure/fmt';

export namespace GetOrderErrors {
  export class TokenNotFound extends Result<UseCaseError> {
    constructor(token: string) {
      super(false, {
        message: sprintf('Token entry not found. Got {0}', token),
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

  export class OrderNotFound extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: sprintf('Unknown Error . Got: {0}', id),
      });
    }
  }
  // export class ConversationDontBelongToCampaign extends Result<UseCaseError> {
  //   constructor(conversationId: string, campaignId: string) {
  //     super(false, {
  //       message: sprintf(
  //         `Error. The conversation ${conversationId} doesn't belong to campaign ${campaignId}`,
  //       ),
  //     });
  //   }
  // }
}

import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';

interface ConversationProps {
  conversationId?: string;
  campaignId: string;
  name: string;
}

export class ConversationId extends Entity<ConversationProps> {
  get conversationId(): string {
    return this.props.conversationId as string;
  }

  get campaignId(): string {
    return this.props.campaignId;
  }

  constructor(props: ConversationProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: ConversationProps,
    id?: UniqueEntityId,
  ): Result<ConversationId> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.conversationId, argName: 'conversationId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<ConversationId>(validator.message);
    }

    const conversation = new ConversationId(props, id);
    return Result.OK<ConversationId>(conversation);
  }
}

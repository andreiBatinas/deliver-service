import { Entity, UniqueEntityId } from '../../../core/domain';
import { Result, Validator } from '../../../core/logic';

interface ConversationCampaignProps {
  conversationId?: string;
  campaignId: string;
  name?: string;
}

export class ConversationCampaign extends Entity<ConversationCampaignProps> {
  get conversationId(): string {
    return this.props.conversationId as string;
  }
  get campaignId(): string {
    return this.props.campaignId;
  }
  get name(): string | undefined {
    return this.props.name as string;
  }

  constructor(props: ConversationCampaignProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: ConversationCampaignProps,
    id?: UniqueEntityId,
  ): Result<ConversationCampaign> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.conversationId, argName: 'conversationId' },
      { arg: props.campaignId, argName: 'campaignId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<ConversationCampaign>(validator.message);
    }

    const conversation = new ConversationCampaign(props, id);
    return Result.OK<ConversationCampaign>(conversation);
  }
}

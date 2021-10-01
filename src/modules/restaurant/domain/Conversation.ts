import { Entity, UniqueEntityId } from '../../../core/domain';
import { Result, Validator } from '../../../core/logic';
import { Module } from './Module';

interface ConversationProps {
  conversationId?: string;
  campaignId: string;
  name: string;
  modules?: Module[];
}

export class Conversation extends Entity<ConversationProps> {
  get conversationId(): string {
    return this.props.conversationId as string;
  }

  get modules(): Module[] | undefined {
    return this.props.modules;
  }

  get campaignId(): string {
    return this.props.campaignId;
  }

  get name(): string {
    return this.props.name;
  }

  constructor(props: ConversationProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(
    props: ConversationProps,
    id?: UniqueEntityId,
  ): Result<Conversation> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.campaignId, argName: 'campaignId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<Conversation>(validator.message);
    }

    const conversation = new Conversation(props, id);
    return Result.OK<Conversation>(conversation);
  }
}

import {
  Entity,
  UniqueEntityId,
} from '../../../core/domain';
import {
  Result,
  Validator,
} from '../../../core/logic';
import { Conversation } from '../../../infrastructure/typeorm/models';

interface ModuleProps {
  id?: string;
  moduleId?: string;
  conversation: Conversation;
  name: string;
  prompt: string;
  moduleType: string;
  nextModuleId: string;
  updatedAt: string;
}

export class Module extends Entity<ModuleProps> {
  get id(): string {
    return this.props.id as string;
  }

  get moduleId(): string {
    return this.props.moduleId as string;
  }

  get conversation(): Conversation {
    return this.props.conversation;
  }

  get name(): string {
    return this.props.name;
  }

  get prompt(): string {
    return this.props.prompt;
  }

  get moduleType(): string {
    return this.props.moduleType;
  }

  get nextModuleId(): string {
    return this.props.nextModuleId;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  constructor(props: ModuleProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: ModuleProps, id?: UniqueEntityId): Result<Module> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.name, argName: 'module_name' },
      { arg: props.conversation, argName: 'conversation_id' },
      { arg: props.moduleType, argName: 'module_type' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<Module>(validator.message);
    }

    const conversation = new Module(props, id);
    return Result.OK<Module>(conversation);
  }
}

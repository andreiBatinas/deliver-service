import {
  Conversation,
  InputType,
  Module,
  ModuleType,
} from '../../../infrastructure/typeorm/models';
import { ConversationRepo } from './ConversationRepo';
import { InputTypeRepo } from './InputTypeRepo';
import { ModuleRepo } from './ModuleRepo';
import { ModuleTypeRepo } from './ModuleTypeRepo';

const conversationRepo = new ConversationRepo({ Conversation });
const moduleRepo = new ModuleRepo({ Module });
const moduleTypeRepo = new ModuleTypeRepo({ ModuleType });
const inputTypeRepo = new InputTypeRepo({ InputType });

export { conversationRepo, moduleRepo, moduleTypeRepo, inputTypeRepo };

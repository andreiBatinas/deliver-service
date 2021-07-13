import { Account, Fleet } from '../../../infrastructure/typeorm/models';
import { Conversation } from '../../../infrastructure/typeorm/models/oldModels';
import { AccountRepo } from './AccountRepo';
import { FleetRepo } from './FleetRepo';
import { ConversationRepo } from './oldRepo/ConversationRepo';

const conversationRepo = new ConversationRepo({ Conversation });
const fleetRepo = new FleetRepo({ Fleet });

const accountRepo = new AccountRepo({ Account });

export { conversationRepo, fleetRepo, accountRepo };

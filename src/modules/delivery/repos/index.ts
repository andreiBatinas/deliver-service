import {
  Account,
  Fleet,
  Order,
  Restaurant,
  User,
} from '../../../infrastructure/typeorm/models';
import { Conversation } from '../../../infrastructure/typeorm/models/oldModels';
import { AccountRepo } from './AccountRepo';
import { FleetRepo } from './FleetRepo';
import { ConversationRepo } from './oldRepo/ConversationRepo';
import { OrderRepo } from './OrderRepo';
import { RestaurantRepo } from './RestaurantRepo';
import { UserRepo } from './UserRepo';

const conversationRepo = new ConversationRepo({ Conversation });
const fleetRepo = new FleetRepo({ Fleet });
const accountRepo = new AccountRepo({ Account });
const userRepo = new UserRepo({ User });
const restaurantRepo = new RestaurantRepo({ Restaurant });
const orderRepo = new OrderRepo({ Order });

export {
  conversationRepo,
  fleetRepo,
  accountRepo,
  userRepo,
  restaurantRepo,
  orderRepo,
};

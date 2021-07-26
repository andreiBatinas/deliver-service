import { restaurantRepo } from '../../repos';
import { GetRestaurantController } from './GetRestaurantController';
import { GetRestaurantUseCase } from './GetRestaurantUseCase';

const getRestaurantUseCase = new GetRestaurantUseCase(restaurantRepo);

export { getRestaurantUseCase, GetRestaurantController };

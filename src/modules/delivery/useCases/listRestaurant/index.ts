import { restaurantRepo } from '../../repos';
import { ListRestaurantController } from './ListRestaurantController';
import { ListRestaurantUseCase } from './ListRestaurantUseCase';

const listRestaurantUseCase = new ListRestaurantUseCase(restaurantRepo);

export { listRestaurantUseCase, ListRestaurantController };

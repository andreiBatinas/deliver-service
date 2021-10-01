import { restaurantRepo } from '../../repos';
import { RemoveRestaurantController } from './RemoveRestaurantController';
import { RemoveRestaurantUseCase } from './RemoveRestaurantUseCase';

const removeRestaurantUseCase = new RemoveRestaurantUseCase(restaurantRepo);

export { removeRestaurantUseCase, RemoveRestaurantController };

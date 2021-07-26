import { restaurantRepo } from '../../repos';
import { UpdateRestaurantController } from './UpdateRestaurantController';
import { UpdateRestaurantUseCase } from './UpdateRestaurantUseCase';

const updateRestaurantUseCase = new UpdateRestaurantUseCase(restaurantRepo);

export { updateRestaurantUseCase, UpdateRestaurantController };

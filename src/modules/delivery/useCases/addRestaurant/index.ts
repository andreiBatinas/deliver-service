import { restaurantRepo } from '../../repos';
import { AddRestaurantController } from './AddRestaurantController';
import { AddRestaurantUseCase } from './AddRestaurantUseCase';

const addRestaurantUseCase = new AddRestaurantUseCase(restaurantRepo);

export { addRestaurantUseCase, AddRestaurantController };

import {
  fleetRepo,
  restaurantRepo,
} from '../../repos';
import { AddRestaurantController } from './AddRestaurantController';
import { AddRestaurantUseCase } from './AddRestaurantUseCase';

const addRestaurantUseCase = new AddRestaurantUseCase(
  restaurantRepo,
  fleetRepo,
);

export { addRestaurantUseCase, AddRestaurantController };

import { fleetRepo } from '../../repos';
import { AddFleetController } from './AddFleetController';
import { AddFleetUseCase } from './AddFleetUseCase';

const addFleetUseCase = new AddFleetUseCase(fleetRepo);

export { addFleetUseCase, AddFleetController };

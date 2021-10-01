import { fleetRepo } from '../../repos';
import { UpdateFleetController } from './UpdateFleetController';
import { UpdateFleetUseCase } from './UpdateFleetUseCase';

const updateFleetUseCase = new UpdateFleetUseCase(fleetRepo);

export { updateFleetUseCase, UpdateFleetController };

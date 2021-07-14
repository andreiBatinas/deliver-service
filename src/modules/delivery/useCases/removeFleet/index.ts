import { fleetRepo } from '../../repos';
import { RemoveFleetController } from './RemoveFleetController';
import { RemoveFleetUseCase } from './RemoveFleetUseCase';

const removeFleetUseCase = new RemoveFleetUseCase(fleetRepo);

export { removeFleetUseCase, RemoveFleetController };

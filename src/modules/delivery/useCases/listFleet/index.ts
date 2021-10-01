import { fleetRepo } from '../../repos';
import { ListFleetController } from './ListFleetController';
import { ListFleetUseCase } from './ListFleetUseCase';

const listFleetUseCase = new ListFleetUseCase(fleetRepo);

export { listFleetUseCase, ListFleetController };

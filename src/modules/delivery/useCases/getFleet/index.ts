import { fleetRepo } from '../../repos';
import { GetFleetController } from './GetFleetController';
import { GetFleetUseCase } from './GetFleetUseCase';

const getFleetUseCase = new GetFleetUseCase(fleetRepo);

export { getFleetUseCase, GetFleetController };

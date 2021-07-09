import { Router } from 'express';
import { systemRouter } from '../../../core/infrastructure/http/defaults/router';
import { deliveryRouter } from '../../../modules/delivery/infrastructure/http/routes';

const r = Router();
// Default routes
r.use('/', systemRouter);

// App routes
r.use('/service/delivery', deliveryRouter);
//r.use('/service/mobile', mobileRouter);
//r.use('/service/restaurant', restaurantRouter);

export { r };

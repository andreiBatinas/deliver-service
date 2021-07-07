import { Router } from 'express';
import { systemRouter } from '../../../core/infrastructure/http/defaults/router';
import { deliveryRouter } from '../../../modules/delivery/account/infrastructure/http/routes';
import { mobileRouter } from '../../../modules/mobile/authenticate/infrastructure/http/routes';
import { restaurantRouter } from '../../../modules/restaurant/authenticate/infrastructure/http/routes';


const r = Router();
// Default routes
r.use('/', systemRouter);

// App routes
r.use('/api/delivery', deliveryRouter);
r.use('/api/mobile', mobileRouter);
r.use('/api/restaurant', restaurantRouter);

export { r };


import { Router } from 'express';

import { systemRouter } from '../../../core/infrastructure/http/defaults/router';
import { conversationRouter } from '../../../modules/conversations/infrastructure/http/routes';

const r = Router();
// Default routes
r.use('/', systemRouter);

// App routes
r.use('/api/conversation', conversationRouter);

export { r };

import {
  Request,
  Response,
  Router,
} from 'express';

import {
  PingController,
  pingUseCase,
} from '../useCase/getPing';

const systemRouter = Router();

systemRouter.get('/ping', (req: Request, res: Response) => {
  const pingController = new PingController(pingUseCase);
  void pingController.execute(req, res);
});

export { systemRouter };

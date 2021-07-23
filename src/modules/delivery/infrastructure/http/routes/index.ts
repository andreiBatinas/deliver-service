import {
  Request,
  Response,
  Router,
} from 'express';

import {
  AddFleetController,
  addFleetUseCase,
} from '../../../useCases/addFleet';
import {
  AddUserController,
  addUserUseCase,
} from '../../../useCases/addUser';
import {
  AuthenticateAccountController,
  authenticateAccountUseCase,
} from '../../../useCases/authenticateAccount';
import {
  CreateAccountController,
  createAccountUseCase,
} from '../../../useCases/createAccount';
import { getFleetUseCase } from '../../../useCases/getFleet';
import { GetFleetController } from '../../../useCases/getFleet/GetFleetController';
import {
  GetUserController,
  getUserUseCase,
} from '../../../useCases/getUser';
import {
  ListFleetController,
  listFleetUseCase,
} from '../../../useCases/listFleet';
import {
  RemoveFleetController,
  removeFleetUseCase,
} from '../../../useCases/removeFleet';
import {
  RemoveUserController,
  removeUserUseCase,
} from '../../../useCases/removeUser';
import { updateFleetUseCase } from '../../../useCases/updateFleet';
import { UpdateFleetController } from '../../../useCases/updateFleet/UpdateFleetController';

const deliveryRouter = Router();

deliveryRouter.post('/create-account', async (req: Request, res: Response) => {
  const createAccountController = new CreateAccountController(
    createAccountUseCase,
  );
  await createAccountController.execute(req, res);
});

deliveryRouter.post(
  '/authenticate-account',
  async (req: Request, res: Response) => {
    const authenticateAccountController = new AuthenticateAccountController(
      authenticateAccountUseCase,
    );
    await authenticateAccountController.execute(req, res);
  },
);

//Fleet-routes
deliveryRouter.post('/get-fleet', async (req: Request, res: Response) => {
  const getFleetController = new GetFleetController(getFleetUseCase);
  await getFleetController.execute(req, res);
});

deliveryRouter.post('/update-fleet', async (req: Request, res: Response) => {
  const updateFleetController = new UpdateFleetController(updateFleetUseCase);
  await updateFleetController.execute(req, res);
});

deliveryRouter.post('/add-fleet', async (req: Request, res: Response) => {
  const addFleetController = new AddFleetController(addFleetUseCase);
  await addFleetController.execute(req, res);
});

deliveryRouter.post('/list-fleet', async (req: Request, res: Response) => {
  const listFleetController = new ListFleetController(listFleetUseCase);
  await listFleetController.execute(req, res);
});

deliveryRouter.post('/remove-fleet', async (req: Request, res: Response) => {
  const removeFleetController = new RemoveFleetController(removeFleetUseCase);
  await removeFleetController.execute(req, res);
});

//User-routes
deliveryRouter.post('/add-user', async (req: Request, res: Response) => {
  const addUserController = new AddUserController(addUserUseCase);
  await addUserController.execute(req, res);
});

deliveryRouter.post('/remove-user', async (req: Request, res: Response) => {
  const removeUserController = new RemoveUserController(removeUserUseCase);
  await removeUserController.execute(req, res);
});

deliveryRouter.post('/get-user', async (req: Request, res: Response) => {
  const getUserController = new GetUserController(getUserUseCase);
  await getUserController.execute(req, res);
});

export { deliveryRouter };

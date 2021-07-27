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
  AddOrderController,
  addOrderUseCase,
} from '../../../useCases/addOrder';
import {
  AddRestaurantController,
  addRestaurantUseCase,
} from '../../../useCases/addRestaurant';
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
  GetOrderController,
  getOrderUseCase,
} from '../../../useCases/getOrder';
import {
  GetRestaurantController,
  getRestaurantUseCase,
} from '../../../useCases/getRestaurant';
import {
  GetUserController,
  getUserUseCase,
} from '../../../useCases/getUser';
import {
  ListFleetController,
  listFleetUseCase,
} from '../../../useCases/listFleet';
import {
  ListOrderController,
  listOrderUseCase,
} from '../../../useCases/listOrder';
import {
  ListRestaurantController,
  listRestaurantUseCase,
} from '../../../useCases/listRestaurant';
import {
  ListUserController,
  listUserUseCase,
} from '../../../useCases/listUser';
import {
  RemoveFleetController,
  removeFleetUseCase,
} from '../../../useCases/removeFleet';
import {
  RemoveOrderController,
  removeOrderUseCase,
} from '../../../useCases/removeOrder';
import {
  RemoveRestaurantController,
  removeRestaurantUseCase,
} from '../../../useCases/removeRestaurant';
import {
  RemoveUserController,
  removeUserUseCase,
} from '../../../useCases/removeUser';
import { updateFleetUseCase } from '../../../useCases/updateFleet';
import { UpdateFleetController } from '../../../useCases/updateFleet/UpdateFleetController';
import {
  UpdateOrderController,
  updateOrderUseCase,
} from '../../../useCases/updateOrder';
import {
  UpdateRestaurantController,
  updateRestaurantUseCase,
} from '../../../useCases/updateRestaurant';
import {
  UpdateUserController,
  updateUserUseCase,
} from '../../../useCases/updateUser';

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

//Order-routes
deliveryRouter.post('/add-order', async (req: Request, res: Response) => {
  const addOrderController = new AddOrderController(addOrderUseCase);
  await addOrderController.execute(req, res);
});

deliveryRouter.post('/get-order', async (req: Request, res: Response) => {
  const getOrderController = new GetOrderController(getOrderUseCase);
  await getOrderController.execute(req, res);
});

deliveryRouter.post('/list-order', async (req: Request, res: Response) => {
  const listOrderController = new ListOrderController(listOrderUseCase);
  await listOrderController.execute(req, res);
});

deliveryRouter.post('/remove-order', async (req: Request, res: Response) => {
  const removeOrderController = new RemoveOrderController(removeOrderUseCase);
  await removeOrderController.execute(req, res);
});

deliveryRouter.post('/update-order', async (req: Request, res: Response) => {
  const updateOrderController = new UpdateOrderController(updateOrderUseCase);
  await updateOrderController.execute(req, res);
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

deliveryRouter.post('/list-user', async (req: Request, res: Response) => {
  const listUserController = new ListUserController(listUserUseCase);
  await listUserController.execute(req, res);
});

deliveryRouter.post('/update-user', async (req: Request, res: Response) => {
  const updateUserController = new UpdateUserController(updateUserUseCase);
  await updateUserController.execute(req, res);
});

//Restaurant-routes
deliveryRouter.post('/add-restaurant', async (req: Request, res: Response) => {
  const addRestaurantController = new AddRestaurantController(
    addRestaurantUseCase,
  );
  await addRestaurantController.execute(req, res);
});

deliveryRouter.post(
  '/remove-restaurant',
  async (req: Request, res: Response) => {
    const removeRestaurantController = new RemoveRestaurantController(
      removeRestaurantUseCase,
    );
    await removeRestaurantController.execute(req, res);
  },
);

deliveryRouter.post('/get-restaurant', async (req: Request, res: Response) => {
  const getRestaurantController = new GetRestaurantController(
    getRestaurantUseCase,
  );
  await getRestaurantController.execute(req, res);
});

deliveryRouter.post('/list-restaurant', async (req: Request, res: Response) => {
  const listRestaurantController = new ListRestaurantController(
    listRestaurantUseCase,
  );
  await listRestaurantController.execute(req, res);
});

deliveryRouter.post(
  '/update-restaurant',
  async (req: Request, res: Response) => {
    const updateRestaurantController = new UpdateRestaurantController(
      updateRestaurantUseCase,
    );
    await updateRestaurantController.execute(req, res);
  },
);

export { deliveryRouter };

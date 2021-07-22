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
  AuthenticateAccountController,
  authenticateAccountUseCase,
} from '../../../useCases/authenticateAccount';
import {
  CreateAccountController,
  createAccountUseCase,
} from '../../../useCases/createAccount';
import {
  RemoveFleetController,
  removeFleetUseCase,
} from '../../../useCases/removeFleet';
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
// .post('/list-conversation', async (req: Request, res: Response) => {
//   const listConversationController = new ListConversationController(
//     listConversationUseCase,
//   );
//   await listConversationController.execute(req, res);
// })

// .post('/get-conversation', async (req: Request, res: Response) => {
//   const getConversationController = new GetConversationController(
//     getConversationUseCase,
//   );
//   await getConversationController.execute(req, res);
// })

// .post('/remove-conversation', async (req: Request, res: Response) => {
//   const removeModuleController = new RemoveConversationController(
//     removeConversationUseCase,
//   );
//   await removeModuleController.execute(req, res);
// })

deliveryRouter.post('/update-fleet', async (req: Request, res: Response) => {
  const updateFleetController = new UpdateFleetController(updateFleetUseCase);
  await updateFleetController.execute(req, res);
});
deliveryRouter.post('/add-fleet', async (req: Request, res: Response) => {
  const addFleetController = new AddFleetController(addFleetUseCase);
  await addFleetController.execute(req, res);
});

// .post('/module/list-module', async (req: Request, res: Response) => {
//   const listModuleController = new ListModuleController(listModuleUseCase);
//   await listModuleController.execute(req, res);
// })

deliveryRouter.post('/remove-fleet', async (req: Request, res: Response) => {
  const removeFleetController = new RemoveFleetController(removeFleetUseCase);
  await removeFleetController.execute(req, res);
});

// .post('/module/update-module', async (req: Request, res: Response) => {
//   const updateModuleController = new UpdateModuleController(
//     updateModuleUseCase,
//   );
//   await updateModuleController.execute(req, res);
// })

// .post(
//   '/module/input-type/add-input-type',
//   async (req: Request, res: Response) => {
//     const addInputTypeController = new AddInputTypeController(
//       addInputTypeUseCase,
//     );
//     await addInputTypeController.execute(req, res);
//   },
// )

// .post(
//   '/module/input-type/update-input-type',
//   async (req: Request, res: Response) => {
//     const updateInputTypeController = new UpdateInputTypeController(
//       updateInputTypeUseCase,
//     );
//     await updateInputTypeController.execute(req, res);
//   },
// );

export { deliveryRouter };

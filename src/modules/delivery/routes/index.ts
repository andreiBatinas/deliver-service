import {
  Request,
  Response,
  Router,
} from 'express';

import {
  AddInputTypeController,
  addInputTypeUseCase,
} from '../../../useCases/addInputType';
import { addModuleUseCase } from '../../../useCases/addModule';
import { AddModuleController } from '../../../useCases/addModule/AddModuleController';
import {
  CreateConversationController,
  createConversationUseCase,
} from '../../../useCases/createConversation';
import { getConversationUseCase } from '../../../useCases/getConversation';
import { GetConversationController } from '../../../useCases/getConversation/GetConversationController';
import { listConversationUseCase } from '../../../useCases/listConversation';
import { ListConversationController } from '../../../useCases/listConversation/ListConversationController';
import { listModuleUseCase } from '../../../useCases/listModule';
import { ListModuleController } from '../../../useCases/listModule/ListModuleController';
import { removeConversationUseCase } from '../../../useCases/removeConversation';
import { RemoveConversationController } from '../../../useCases/removeConversation/RemoveConversationController';
import {
  RemoveModuleController,
  removeModuleUseCase,
} from '../../../useCases/removeModule';
import { updateConversationUseCase } from '../../../useCases/updateConversation';
import { UpdateConversationController } from '../../../useCases/updateConversation/UpdateConversationController';
import { updateInputTypeUseCase } from '../../../useCases/updateInputType';
import { UpdateInputTypeController } from '../../../useCases/updateInputType/UpdateInputTypeController';
import {
  UpdateModuleController,
  updateModuleUseCase,
} from '../../../useCases/updateModule';

const conversationRouter = Router();

conversationRouter
  .post('/create-conversation', async (req: Request, res: Response) => {
    const createConversationController = new CreateConversationController(
      createConversationUseCase,
    );
    await createConversationController.execute(req, res);
  })

  .post('/list-conversation', async (req: Request, res: Response) => {
    const listConversationController = new ListConversationController(
      listConversationUseCase,
    );
    await listConversationController.execute(req, res);
  })

  .post('/get-conversation', async (req: Request, res: Response) => {
    const getConversationController = new GetConversationController(
      getConversationUseCase,
    );
    await getConversationController.execute(req, res);
  })

  .post('/remove-conversation', async (req: Request, res: Response) => {
    const removeModuleController = new RemoveConversationController(
      removeConversationUseCase,
    );
    await removeModuleController.execute(req, res);
  })

  .post('/update-conversation', async (req: Request, res: Response) => {
    const updateConversationController = new UpdateConversationController(
      updateConversationUseCase,
    );
    await updateConversationController.execute(req, res);
  })
  .post('/module/add-module', async (req: Request, res: Response) => {
    const addModuleController = new AddModuleController(addModuleUseCase);
    await addModuleController.execute(req, res);
  })

  .post('/module/list-module', async (req: Request, res: Response) => {
    const listModuleController = new ListModuleController(listModuleUseCase);
    await listModuleController.execute(req, res);
  })

  .post('/module/remove-module', async (req: Request, res: Response) => {
    const removeModuleController = new RemoveModuleController(
      removeModuleUseCase,
    );
    await removeModuleController.execute(req, res);
  })

  .post('/module/update-module', async (req: Request, res: Response) => {
    const updateModuleController = new UpdateModuleController(
      updateModuleUseCase,
    );
    await updateModuleController.execute(req, res);
  })

  .post(
    '/module/input-type/add-input-type',
    async (req: Request, res: Response) => {
      const addInputTypeController = new AddInputTypeController(
        addInputTypeUseCase,
      );
      await addInputTypeController.execute(req, res);
    },
  )

  .post(
    '/module/input-type/update-input-type',
    async (req: Request, res: Response) => {
      const updateInputTypeController = new UpdateInputTypeController(
        updateInputTypeUseCase,
      );
      await updateInputTypeController.execute(req, res);
    },
  );

export { conversationRouter };

import { Router } from "express";
import ClientController from "../controller/client.controller";
import ValidatorShema from "../middleware/validator.middleware";
import { authentificated } from "../middleware/validator/authenticated";
import { authMiddleware, authorization } from "../middleware/auth.middlevare";


const routerClient = Router();

const clientController = new ClientController();
routerClient.get('/:id', clientController.edit);
routerClient.get('/',authMiddleware(),authorization(["ADMIN"]), clientController.show);
routerClient.post('/', [ ValidatorShema()] ,clientController.store);

export default routerClient;

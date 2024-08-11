import { Router } from "express";
import ClientController from "../controller/client.controller";
import ValidatorShema from "../middleware/validator.middleware";


const routerClient = Router();

const clientController = new ClientController();
routerClient.get('/:id', clientController.edit);
routerClient.get('/', clientController.show);
routerClient.post('/', [ValidatorShema()], clientController.store);
routerClient.post('/login', clientController.login);

export default routerClient;

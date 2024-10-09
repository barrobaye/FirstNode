import { Router } from "express";
import ClientController from "../controller/client.controller";
import ValidatorShema from "../middleware/validator.middleware";
import { authentificated } from "../middleware/validator/authenticated";
import { authMiddleware, authorization } from "../middleware/auth.middlevare";


const routerClient = Router();

const clientController = new ClientController();
routerClient.get('/:id', clientController.edit);
routerClient.get('/:id/dettes', clientController.editClientDette);
routerClient.get('/dettes/:id/articles', clientController.editClientDetailDette);
routerClient.get('/dettes/:id/paiement', clientController.editClientPaiement);
routerClient.get('/:id/user', clientController.editClientUser);
routerClient.get('/', clientController.show);
routerClient.post('/',clientController.store);
routerClient.post('/telephone',clientController.findByPhone);



// routerClient.get('/:id',authMiddleware(),authorization(["ADMIN","BOUTIQUIER"]), clientController.edit);
// routerClient.get('/',authMiddleware(),authorization(["ADMIN","BOUTIQUIER"]), clientController.show);
// routerClient.post('/', [ValidatorShema(),authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])] ,clientController.store);

export default routerClient;

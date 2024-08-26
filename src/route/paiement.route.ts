import { Router } from "express";
import ValidatorShema from "../middleware/validator.middleware";
import PaiementController from "../controller/paiement.controlleur";
import { authMiddleware, authorization } from "../middleware/auth.middlevare";

const routerPaiement = Router ();

const paiementController = new PaiementController;
routerPaiement.get('/:id', paiementController.edit);
routerPaiement.get('/:status', paiementController.filterBy);

//routerArticle.post('/libelle', paiementController.editByLibelle);
routerPaiement.get('/',authMiddleware(),authorization(["ADMIN","BOUTIQUIER"]), paiementController.show);
routerPaiement.post('/', paiementController.store);

export  default routerPaiement;
///[authMiddleware(),authorization(["ADMIN","BOUTIQUIER","CLIENT"])]
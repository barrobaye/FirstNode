import { Router } from "express";
import ValidatorShema from "../middleware/validator.middleware";
import PaiementController from "../controller/paiement.controlleur";

const routerPaiement = Router ();

const paiementController = new PaiementController;
routerPaiement.get('/:id', paiementController.edit);
//routerArticle.post('/libelle', paiementController.editByLibelle);
routerPaiement.get('/', paiementController.show);
routerPaiement.post('/', paiementController.store);

export  default routerPaiement;
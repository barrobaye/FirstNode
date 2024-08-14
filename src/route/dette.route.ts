import { Router } from "express";
import DetteController from "../controller/dette.controller";

const routerDette = Router ();

const articleController = new DetteController;
routerDette.get('/:id', articleController.edit);
//routerDette.post('/libelle', articleController.editByLibelle);
routerDette.get('/', articleController.show);
routerDette.post('/', articleController.store);

export  default routerDette;
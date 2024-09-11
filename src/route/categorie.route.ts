import { Router } from "express";
import CategorieController from "../controller/categorie.controller";

const routerCategorie = Router ();

const categorieController = new CategorieController;


routerCategorie.get('/:id', categorieController.remove);
routerCategorie.get('/', categorieController.show);
routerCategorie.post('/', categorieController.store);

export  default routerCategorie;
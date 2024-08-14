import { Router } from "express";
import ArticleController from "../controller/article.controller";
import ValidatorShema from "../middleware/validator.middleware";

const routerArticle = Router ();

const articleController = new ArticleController;
routerArticle.get('/:id', articleController.edit);
//routerArticle.post('/libelle', articleController.editByLibelle);
routerArticle.get('/', articleController.show);
routerArticle.post('/',[ValidatorShema()], articleController.store);

export  default routerArticle;
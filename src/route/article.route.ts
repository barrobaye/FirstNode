import { Router } from "express";
import ArticleController from "../controller/article.controller";
import ValidatorShema from "../middleware/validator.middleware";
import { authMiddleware, authorization } from "../middleware/auth.middlevare";

const routerArticle = Router ();

const articleController = new ArticleController;
routerArticle.get('/:id',[authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])], articleController.edit);
//routerArticle.post('/libelle', articleController.editByLibelle);
routerArticle.get('/',[authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])], articleController.show);
routerArticle.post('/',[ValidatorShema(),authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])], articleController.store);

export  default routerArticle;
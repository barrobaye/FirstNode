import { Router } from "express";
import ArticleController from "../controller/article.controller";
import ValidatorShema from "../middleware/validator.middleware";
import { authMiddleware, authorization } from "../middleware/auth.middlevare";

const routerArticle = Router ();

const articleController = new ArticleController;
routerArticle.get('/:id', articleController.edit);
routerArticle.get('/', articleController.show);
routerArticle.post('/', articleController.store);
routerArticle.put('/:id', articleController.update);
routerArticle.delete('/:id', articleController.remove);

export  default routerArticle;




//[authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])]
//[ValidatorShema(),authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])],
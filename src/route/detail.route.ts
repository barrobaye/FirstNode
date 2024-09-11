import { Router } from "express";
import ValidatorShema from "../middleware/validator.middleware";
import { authMiddleware, authorization } from "../middleware/auth.middlevare";
import DetailController from "../controller/detail.controller";

const routerDetail = Router ();

const detailController = new DetailController;
routerDetail.get('/:id', detailController.edit);
routerDetail.get('/', detailController.show);
routerDetail.post('/', detailController.store);
//routerArticle.delete('/:id', detailController.remove);

export  default routerDetail;

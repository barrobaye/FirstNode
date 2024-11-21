import { Router } from "express";
import ValidatorShema from "../middleware/validator.middleware";
import UserController from "../controller/user.controller";


const routerUser = Router();
//console.log("ok");
const userController = new UserController();
//routerUser.get('/:id', userController.edit);
routerUser.get('/', userController.show);
routerUser.post('/' ,userController.store);

export default routerUser;
// authMiddleware(),authorization(["ADMIN","BOUTIQUIER"]),
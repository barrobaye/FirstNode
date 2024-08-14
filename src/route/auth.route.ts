import { Router } from "express";
import ValidatorShema from "../middleware/validator.middleware";
import AuthController from "../controller/auth.controller";

const routerAuth = Router ();

const authController = new AuthController;

routerAuth.post('/login', authController.login);
routerAuth.post('/register',authController.register);
routerAuth.post('/logout', authController.logout);

export  default routerAuth;
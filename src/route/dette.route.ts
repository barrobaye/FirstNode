import { Router } from "express";
import DetteController from "../controller/dette.controller";
import ValidatorShema from "../middleware/validator.middleware";

const router = Router();
const detteController = new DetteController();

router.post('/', detteController.store.bind(detteController));
router.get('/:id', detteController.show.bind(detteController));
router.put('/:id', detteController.edit.bind(detteController)); // Ensure the method exists in the controller

export default router;

// import { Router } from "express";
// import DetteController from "../controller/dette.controller";
// import { authMiddleware, authorization } from "../middleware/auth.middlevare";

// const routerDette = Router ();

// const detteController = new DetteController;
// routerDette.get('/:id',[authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])],detteController.edit);
// //routerDette.post('/libelle', articleController.editByLibelle);
// routerDette.get('/',[authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])],detteController.show);
// routerDette.post('/', detteController.store);

// // export  default routerDette  ,[ValidatorShema()]

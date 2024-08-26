"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dette_controller_1 = __importDefault(require("../controller/dette.controller"));
const validator_middleware_1 = __importDefault(require("../middleware/validator.middleware"));
const router = (0, express_1.Router)();
const detteController = new dette_controller_1.default();
router.post('/', [(0, validator_middleware_1.default)()], detteController.store.bind(detteController));
router.get('/:id', detteController.show.bind(detteController));
router.put('/:id', detteController.edit.bind(detteController)); // Ensure the method exists in the controller
exports.default = router;
// import { Router } from "express";
// import DetteController from "../controller/dette.controller";
// import { authMiddleware, authorization } from "../middleware/auth.middlevare";
// const routerDette = Router ();
// const detteController = new DetteController;
// routerDette.get('/:id',[authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])],detteController.edit);
// //routerDette.post('/libelle', articleController.editByLibelle);
// routerDette.get('/',[authMiddleware(),authorization(["ADMIN","BOUTIQUIER"])],detteController.show);
// routerDette.post('/', detteController.store);
// // export  default routerDette

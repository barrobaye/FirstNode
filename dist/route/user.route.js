"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_middleware_1 = __importDefault(require("../middleware/validator.middleware"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const routerUser = (0, express_1.Router)();
//console.log("ok");
const userController = new user_controller_1.default();
//routerUser.get('/:id', userController.edit);
//routerUser.get('/', userController.show);
routerUser.post('/', [(0, validator_middleware_1.default)()], userController.store);
exports.default = routerUser;
// authMiddleware(),authorization(["ADMIN","BOUTIQUIER"]),

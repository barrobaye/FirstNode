"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = __importDefault(require("../controller/client.controller"));
const validator_middleware_1 = __importDefault(require("../middleware/validator.middleware"));
const auth_middlevare_1 = require("../middleware/auth.middlevare");
const routerClient = (0, express_1.Router)();
const clientController = new client_controller_1.default();
routerClient.get('/:id', (0, auth_middlevare_1.authMiddleware)(), (0, auth_middlevare_1.authorization)(["ADMIN", "BOUTIQUIER"]), clientController.edit);
routerClient.get('/', (0, auth_middlevare_1.authMiddleware)(), (0, auth_middlevare_1.authorization)(["ADMIN", "BOUTIQUIER"]), clientController.show);
routerClient.post('/', [(0, validator_middleware_1.default)(), (0, auth_middlevare_1.authMiddleware)(), (0, auth_middlevare_1.authorization)(["ADMIN", "BOUTIQUIER"])], clientController.store);
exports.default = routerClient;

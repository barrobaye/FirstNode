"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = __importDefault(require("../controller/article.controller"));
const validator_middleware_1 = __importDefault(require("../middleware/validator.middleware"));
const auth_middlevare_1 = require("../middleware/auth.middlevare");
const routerArticle = (0, express_1.Router)();
const articleController = new article_controller_1.default;
routerArticle.get('/:id', [(0, auth_middlevare_1.authMiddleware)(), (0, auth_middlevare_1.authorization)(["ADMIN", "BOUTIQUIER"])], articleController.edit);
//routerArticle.post('/libelle', articleController.editByLibelle);
routerArticle.get('/', [(0, auth_middlevare_1.authMiddleware)(), (0, auth_middlevare_1.authorization)(["ADMIN", "BOUTIQUIER"])], articleController.show);
routerArticle.post('/', [(0, validator_middleware_1.default)(), (0, auth_middlevare_1.authMiddleware)(), (0, auth_middlevare_1.authorization)(["ADMIN", "BOUTIQUIER"])], articleController.store);
exports.default = routerArticle;

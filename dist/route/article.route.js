"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = __importDefault(require("../controller/article.controller"));
const validator_middleware_1 = __importDefault(require("../middleware/validator.middleware"));
const routerArticle = (0, express_1.Router)();
const articleController = new article_controller_1.default;
routerArticle.get('/:id', articleController.edit);
routerArticle.post('/libelle', articleController.editBylibelle);
routerArticle.get('/', articleController.show);
routerArticle.post('/', (0, validator_middleware_1.default)(), articleController.store);
exports.default = routerArticle;

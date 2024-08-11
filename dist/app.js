"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_route_1 = __importDefault(require("./route/article.route"));
const client_route_1 = __importDefault(require("./route/client.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
//app.get("/api/v1/article", new ArticleController().edit)
app.use("/api/v1/article", article_route_1.default);
app.use("/api/v1/clients", client_route_1.default);
exports.default = app;

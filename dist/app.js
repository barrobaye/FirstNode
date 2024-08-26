"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_route_1 = __importDefault(require("./route/article.route"));
const client_route_1 = __importDefault(require("./route/client.route"));
const prisma_config_1 = __importDefault(require("./config/prisma.config"));
const auth_route_1 = __importDefault(require("./route/auth.route"));
const dette_route_1 = __importDefault(require("./route/dette.route"));
const paiement_route_1 = __importDefault(require("./route/paiement.route"));
const user_route_1 = __importDefault(require("./route/user.route"));
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.middleware();
        this.routes();
        this.prisma = prisma_config_1.default;
    }
    middleware() {
        this.server.use(express_1.default.json());
    }
    routes() {
        this.server.use("/api/v1/article", article_route_1.default),
            this.server.use("/api/v1/clients", client_route_1.default),
            this.server.use("/api/v1/dette", dette_route_1.default),
            this.server.use("/api/v1/auth", auth_route_1.default),
            this.server.use("/api/v1/paiement", paiement_route_1.default),
            this.server.use("/api/v1/users", user_route_1.default);
    }
}
const server = (0, express_1.default)();
//app.get("/api/v1/article", new ArticleController().edit)
const app = new App();
exports.default = app;

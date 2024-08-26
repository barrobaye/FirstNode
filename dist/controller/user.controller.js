"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const http_status_codes_1 = require("http-status-codes");
const controller_1 = __importDefault(require("../core/impl/controller"));
const response_1 = __importDefault(require("../core/response"));
const library_1 = require("@prisma/client/runtime/library");
const encrypt_1 = require("../helper/encrypt");
class UserController extends controller_1.default {
    async store(req, res) {
        try {
            const newClient = await app_1.default.prisma.user.create({
                data: {
                    email: req.body.email,
                    password: await encrypt_1.encrypt.encryptepass(req.body.password),
                    role: req.body.role
                }
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response({ client: newClient }, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            console.error("Error Details:", error);
            if (error instanceof library_1.PrismaClientValidationError) {
                console.error("Prisma Validation Error:", error.message);
            }
            else {
                console.error("Unexpected Error:", error);
            }
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors du traitement"));
        }
    }
    async show(req, res) {
    }
    edit(req, res) {
    }
}
exports.default = UserController;

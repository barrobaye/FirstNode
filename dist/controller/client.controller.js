"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../core/impl/controller"));
const http_status_codes_1 = require("http-status-codes");
const response_1 = __importDefault(require("../core/response"));
const app_1 = __importDefault(require("../app"));
class ClientController extends controller_1.default {
    async store(req, res) {
        try {
            const newClient = await app_1.default.prisma.client.create({
                data: req.body
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response({ client: newClient }, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.OK));
        }
    }
    async show(req, res) {
        try {
            const clients = await app_1.default.prisma.client.findMany({
                select: {
                    nom: true,
                    prenom: true,
                    telephone: true,
                }
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response(clients, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
    async edit(req, res) {
        try {
            const client = await app_1.default.prisma.client.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    nom: true,
                    prenom: true,
                    telephone: true,
                }
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response(client, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
}
exports.default = ClientController;

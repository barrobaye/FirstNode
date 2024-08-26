"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../core/impl/controller"));
const http_status_codes_1 = require("http-status-codes");
const response_1 = __importDefault(require("../core/response"));
const app_1 = __importDefault(require("../app"));
class ArticleController extends controller_1.default {
    // Remplacez createAt par createdAt
    async store(req, res) {
        try {
            const newData = await app_1.default.prisma.article.create({
                data: {
                    libelle: req.body.libelle,
                    prix: req.body.prix,
                    quantiteStock: req.body.quantiteStock
                }
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response(newData, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.OK, "Erreur lors du traitement"));
        }
    }
    async show(req, res) {
        try {
            const data = await app_1.default.prisma.article.findMany({
                select: {
                    id: true,
                    libelle: true,
                    prix: true,
                    quantiteStock: true,
                    // correction ici
                }
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response(data, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
    async edit(req, res) {
        try {
            const data = await app_1.default.prisma.article.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    id: true,
                    libelle: true,
                    prix: true,
                    quantiteStock: true,
                    // correction ici
                }
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response(data, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
}
exports.default = ArticleController;

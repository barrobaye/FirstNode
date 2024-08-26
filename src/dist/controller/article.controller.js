"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../core/impl/controller"));
const prisma_model_1 = __importDefault(require("../core/impl/prisma.model"));
const http_status_codes_1 = require("http-status-codes");
const response_1 = __importDefault(require("../core/response"));
class ArticleController extends controller_1.default {
    async store(req, res) {
        // req.params.id 
        try {
            const newData = await prisma_model_1.default.article.create({
                data: req.body
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
        // const id = req.params.id;
        try {
            await prisma_model_1.default.article.findMany({
                select: {
                    libelle: true,
                    prix: true,
                    quantiteStock: true,
                    createAt: true,
                    updatedAt: true
                }
            })
                .then((data) => {
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(data, http_status_codes_1.StatusCodes.OK));
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).
                send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
    async edit(req, res) {
        try {
            await prisma_model_1.default.article.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    libelle: true,
                    prix: true,
                    quantiteStock: true,
                    createAt: true,
                    updatedAt: true
                }
            })
                .then((data) => {
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(data, http_status_codes_1.StatusCodes.OK));
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).
                send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
    async editBylibelle(req, res) {
        try {
            await prisma_model_1.default.article.findFirstOrThrow({
                where: { libelle: req.params.libelle },
                select: {
                    libelle: true,
                    prix: true,
                    quantiteStock: true,
                    createAt: true,
                    updatedAt: true
                }
            })
                .then((data) => {
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(data, http_status_codes_1.StatusCodes.OK));
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).
                send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
}
exports.default = ArticleController;

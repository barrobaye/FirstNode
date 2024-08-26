"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const app_1 = __importDefault(require("../app"));
class DetteController {
    async store(req, res) {
        try {
            const details = req.body.detail;
            // Validate that the detail array exists and contains at least one item
            // Ensure that detail exists and is an array
            if (!details || !Array.isArray(details) || details.length === 0) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .send({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Détails manquants ou format incorrect.",
                });
            }
            // Check if every detail item contains a valid articleId
            for (const detail of details) {
                const articleId = detail.articleId;
                if (!articleId) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send({
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                        message: "Chaque élément de détail doit contenir un articleId valide.",
                    });
                }
                // Verify if the articleId exists in the database
                const articleExists = await app_1.default.prisma.article.findUnique({
                    where: { id: articleId },
                });
                if (!articleExists) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send({
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                        message: `L'article avec l'ID ${articleId} n'existe pas.`,
                    });
                }
            }
            const newDette = await app_1.default.prisma.$transaction(async (tx) => {
                // Create the Dette entry
                const createdDette = await tx.dette.create({
                    data: {
                        montant: req.body.montant,
                        client: {
                            connect: {
                                id: Number(req.body.clientId),
                            },
                        },
                        detail: {
                            create: req.body.detail.map((detail) => ({
                                article: {
                                    connect: {
                                        id: Number(detail.articleId),
                                    },
                                },
                                qteVente: detail.qteVente,
                                prixVente: detail.prixVente,
                            })),
                        },
                    },
                    include: {
                        detail: {
                            select: {
                                article: {
                                    select: {
                                        id: true,
                                        quantiteStock: true,
                                    },
                                },
                                qteVente: true,
                            },
                        },
                    },
                });
                // Update article stock based on the created details
                await Promise.all(createdDette.detail.map(async (detail) => {
                    await tx.article.update({
                        where: {
                            id: detail.article.id,
                        },
                        data: {
                            quantiteStock: detail.article.quantiteStock - detail.qteVente,
                        },
                    });
                }));
                return createdDette;
            });
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: http_status_codes_1.StatusCodes.CREATED,
                data: newDette,
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Erreur lors de la création de la dette",
                error: error.message,
            });
        }
    }
    ;
    // Example of additional methods
    async show(req, res) {
        try {
            const dette = await app_1.default.prisma.dette.findUnique({
                where: { id: Number(req.params.id) },
                include: { detail: true, client: true }
            });
            if (!dette) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "la Dette n'exste pas",
                });
            }
            res.status(http_status_codes_1.StatusCodes.OK).send(dette);
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Erreur lors de la récupération de la dette",
                error: error.message,
            });
        }
    }
    async filterBy(req, res) {
        try {
            const dettes = await app_1.default.prisma.dette.findMany({
                where: {
                    status: true, // Fetch only dettes where the status is true
                },
                include: {
                    client: true,
                    detail: true,
                    paiements: true,
                }
            });
            res.status(http_status_codes_1.StatusCodes.OK).send({
                status: http_status_codes_1.StatusCodes.OK,
                data: dettes,
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Erreur lors du traitement",
            });
        }
    }
    async edit(req, res) {
        try {
            const updatedDette = await app_1.default.prisma.dette.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    montant: req.body.montant,
                    // Add other fields to be updated here
                },
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Erreur lors de la récupération de la dette",
                error: error.message,
            });
        }
    }
}
exports.default = DetteController;

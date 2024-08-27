"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../core/impl/controller"));
const http_status_codes_1 = require("http-status-codes");
const app_1 = __importDefault(require("../app"));
const response_1 = __importDefault(require("../core/response"));
class PaiementController extends controller_1.default {
    async store(req, res) {
        try {
            const { detteId, montantVerser } = req.body;
            const result = await app_1.default.prisma.$transaction(async (tx) => {
                // Vérifier si cette dette existe
                const dette = await tx.dette.findUnique({
                    where: { id: Number(detteId) },
                    include: { paiements: true },
                });
                if (!dette) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(response_1.default.response(null, http_status_codes_1.StatusCodes.NOT_FOUND, "Cette dette n'existe pas"));
                }
                // Calculer le montant restant après le paiement
                const totalPaid = dette.paiements.reduce((sum, p) => sum + p.montantVerser, 0);
                const montantRest = dette.montant - totalPaid - montantVerser;
                // Créer un nouveau paiement
                const newPaiement = await tx.paiement.create({
                    data: {
                        detteId: dette.id,
                        montantVerser,
                        montantRest,
                    },
                });
                // Mettre à jour la dette avec le nouveau montant
                // Mettre à jour la dette avec le nouveau montant et le status
                const updatedDette = await tx.dette.update({
                    where: { id: dette.id },
                    data: {
                        montant: montantRest,
                        status: montantRest === 0 ? true : false,
                    },
                });
                return { newPaiement, updatedDette };
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response(result, http_status_codes_1.StatusCodes.OK, "Paiement créé avec succès"));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors du traitement"));
        }
    }
    async show(req, res) {
        try {
            const data = await app_1.default.prisma.paiement.findMany({
                select: {
                    id: true,
                    detteId: true,
                    montantVerser: true,
                    montantRest: true,
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
            const paiement = await app_1.default.prisma.paiement.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    id: true,
                    montantVerser: true,
                    montantRest: true,
                    dette: {
                        select: {
                            client: {
                                select: {
                                    nom: true,
                                    prenom: true,
                                    telephone: true
                                }
                            }
                        }
                    }
                }
            });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response(paiement, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
}
exports.default = PaiementController;

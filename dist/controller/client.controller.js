"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../core/impl/controller"));
const prisma_model_1 = __importDefault(require("../core/impl/prisma.model"));
const http_status_codes_1 = require("http-status-codes");
const response_1 = __importDefault(require("../core/response"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ClientController extends controller_1.default {
    async store(req, res) {
        try {
            const { nom, prenom, telephone, email, password, role } = req.body;
            // Hash du mot de passe
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // Création du client et de l'utilisateur associé
            const newClient = await prisma_model_1.default.client.create({
                data: {
                    nom,
                    prenom,
                    telephone,
                    user: {
                        create: {
                            email,
                            password: hashedPassword,
                            role: role || 'USER'
                        }
                    }
                },
                include: {
                    user: true
                }
            });
            // Génération du token JWT
            const token = jsonwebtoken_1.default.sign({ userId: newClient.user.id, role: newClient.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response({ client: newClient, token }, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.OK, "Erreur lors du traitement"));
        }
    }
    async show(req, res) {
        try {
            const clients = await prisma_model_1.default.client.findMany({
                select: {
                    id: true,
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
            const client = await prisma_model_1.default.client.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    id: true,
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
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma_model_1.default.user.findUnique({
                where: { email }
            });
            if (!user) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                    .send(response_1.default.response(null, http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials"));
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                    .send(response_1.default.response(null, http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials"));
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(http_status_codes_1.StatusCodes.OK)
                .send(response_1.default.response({ token }, http_status_codes_1.StatusCodes.OK));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .send(response_1.default.response(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error during login"));
        }
    }
    update(req, res) {
        // Logique pour mettre à jour un client
    }
    remove(req, res) {
        // Logique pour supprimer un client
    }
}
exports.default = ClientController;

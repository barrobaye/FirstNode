import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import { StatusCodes } from "http-status-codes";
import RestResponse from "../core/response";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from "@prisma/client";
import app from "../app";

export default class ClientController extends Controller {
    async store(req: Request, res: Response) {
        try {
    
            // Hash du mot de passe
    
            // Utiliser une transaction pour créer le client et l'utilisateur associé
            const newClient = await app.prisma.client.create;
    
            // Génération du token JWT
            // const token = jwt.sign(
            //     { userId: newClient.user.id, role: newClient.user.role },
            //     process.env.JWT_SECRET as string,
            //     { expiresIn: '1h' }
            // );
    
            res.status(StatusCodes.OK)
                .send(RestResponse.response({ client: newClient}, StatusCodes.OK));
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(StatusCodes.CONFLICT).send({ message: "Email already exists" });
                }
            }
            console.error("Error: ", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors du traitement"));
        }
    }
    
    async show(req: Request, res: Response) {
        try {
            const clients = await app.prisma.client.findMany({
                select: {
                    nom: true,
                    prenom: true,
                    telephone: true,
                }
            });

            res.status(StatusCodes.OK)
                .send(RestResponse.response(clients, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const client = await app.prisma.client.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    nom: true,
                    prenom: true,
                    telephone: true,
                }
            });

            res.status(StatusCodes.OK)
                .send(RestResponse.response(client, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await app.prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED)
                    .send(RestResponse.response(null, StatusCodes.UNAUTHORIZED, "Invalid credentials"));
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(StatusCodes.UNAUTHORIZED)
                    .send(RestResponse.response(null, StatusCodes.UNAUTHORIZED, "Invalid credentials"));
            }

            const token = jwt.sign({ userId: user.id, role: user.role}, process.env.JWT_SECRET as string, { expiresIn: '1h' });

            res.status(StatusCodes.OK)
                .send(RestResponse.response({ token }, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR, "Error during login"));
        }
    }

    update(req: Request, res: Response): void {
        // Logique pour mettre à jour un client
    }

    remove(req: Request, res: Response): void {
        // Logique pour supprimer un client
    }
}

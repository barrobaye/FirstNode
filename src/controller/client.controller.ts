import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import { StatusCodes } from "http-status-codes";
import RestResponse from "../core/response";
import app from "../app";

export default class ClientController extends Controller {

    async store(req: Request, res: Response) {
        try {

            const newClient = await app.prisma.client.create({
                data: req.body
            })
            res.status(StatusCodes.OK)
                .send(RestResponse.response({ client: newClient }, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.OK)
                .send(RestResponse.response(error, StatusCodes.OK));
        }
    }
    async show(req: Request, res: Response) {

        try {
            const clients = await app.prisma.client.findMany({
                select: {
                    id: true,
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
    async editClientDette(req: Request, res: Response) {

        try {
            const client = await app.prisma.client.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    nom: true,
                    prenom: true,
                    telephone: true,
                    dette: {
                        select: {
                            id: true,
                            montant: true,
                            date: true,
                            detai: {
                                select: {
                                    id: true,
                                    description: true,
                                    montant: true,
                                    date: true
                                }
                            }
                        }
                    }
                }
            });

            res.status(StatusCodes.OK)
                .send(RestResponse.response(client, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }
    }
    async editClientDetailDette(req: Request, res: Response) {
        try {
            const client = await app.prisma.client.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    dette: {
                        select: {
                            id: true,
                            detail: {
                                select: {
                                    id: true,
                                    article: {
                                        select: {
                                            id: true,
                                            libelle: true,
                                            prix: true,
                                            categorie: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            res.status(StatusCodes.OK)
                .send(RestResponse.response(client, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }
    }
    async editClientPaiement(req: Request, res: Response) {
        try {
            const client = await app.prisma.client.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    dette: {
                        select: {
                            id: true,
                            paiement: {
                                select: {
                                    detteId: true,
                                    montantVerser: true,
                                    montantRest: true,
                                }
                            }
                        }
                    }
                }
            });

            res.status(StatusCodes.OK)
                .send(RestResponse.response(client, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }
    }
    async editClientUser(req: Request, res: Response) {
        try {
            const client = await app.prisma.client.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    User: {
                        select: {
                            id: true,
                            email: true,
                        }
                    }
                }
            });

            res.status(StatusCodes.OK)
                .send(RestResponse.response(client, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }
    }
    async update(req: Request, res: Response) {
        try {
            const updatedClient = await app.prisma.client.update({
                where: { id: Number.parseInt(req.params.id) },
                data: {
                    libelle: req.body.libelle,
                    prix: req.body.prix,
                    quantiteStock: req.body.quantiteStock
                }
            });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(updatedClient, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND, "Erreur lors de la mise à jour de Client"));
        }
    }
    async findByPhone(req: Request, res: Response) {
        try {
            const phone = req.body.telephone;
            // const searchLibelle = req.body.libelle.toLowerCase();  // Convertir en lowercase pour la recherche
            const data = await app.prisma.client.findMany({
                where: {
                    telephone: phone
                },
                select: {
                    nom: true,
                    prenom: true,
                    telephone: true,
                }
            });

            if (data.length > 0) {
                res.status(StatusCodes.OK)
                    .send(RestResponse.response(data, StatusCodes.OK));
            } else {
                res.status(StatusCodes.NOT_FOUND)
                    .send(RestResponse.response(null, StatusCodes.NOT_FOUND, "Aucun Client trouvé avec ce numéro"));
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const deletedClient = await app.prisma.client.delete({
                where: { id: Number.parseInt(req.params.id) },
            });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(deletedClient, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND, "Erreur lors de la suppression de Client"));
        }
    }
}




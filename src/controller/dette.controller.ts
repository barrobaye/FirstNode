import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import app from "../app";
import { Prisma } from "@prisma/client";
import RestResponse from "../core/response";

export default class DetteController {
    async store(req: Request, res: Response) {
        try {
            const { detail, clientId } = req.body;
    
            // Validate that `detail` exists and is an array
            if (!detail || !Array.isArray(detail) || detail.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    status: StatusCodes.BAD_REQUEST,
                    message: "Détails manquants ou format incorrect.",
                });
            }
    
            // Validate and fetch article prices
            const articles = await Promise.all(
                detail.map(async (item: { articleId: number; qteVente: number }) => {
                    const article = await app.prisma.article.findUnique({
                        where: { id: item.articleId },
                        select: { id: true, prix: true, quantiteStock: true },
                    });
    
                    if (!article) {
                        throw new Error(`L'article avec l'ID ${item.articleId} n'existe pas.`);
                    }
    
                    if (item.qteVente > article.quantiteStock) {
                        throw new Error(
                            `La quantité demandée pour l'article ${item.articleId} dépasse le stock disponible.`
                        );
                    }
    
                    return { ...item, prixVente: article.prix };
                })
            );
    
            // Calculate total montant
            const totalMontant = articles.reduce((sum, item) => {
                return sum + item.qteVente * item.prixVente;
            }, 0);
    
            const newDette = await app.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                // Create the `Dette` entry
                const createdDette = await tx.dette.create({
                    data: {
                        montant: totalMontant,
                        client: {
                            connect: { id: Number(clientId) },
                        },
                        detail: {
                            create: articles.map((item) => ({
                                article: { connect: { id: item.articleId } },
                                qteVente: item.qteVente,
                                prixVente: item.prixVente,
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
                                prixVente: true,
                            },
                        },
                    },
                });
    
                // Update article stock based on the created details
                await Promise.all(
                    createdDette.detail.map(async (detail: any) => {
                        await tx.article.update({
                            where: { id: detail.article.id },
                            data: { quantiteStock: detail.article.quantiteStock - detail.qteVente },
                        });
                    })
                );
    
                return createdDette;
            });
    
            res.status(StatusCodes.CREATED).json({
                status: StatusCodes.CREATED,
                data: newDette,
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: (error as Error).message,
            });
        }
    }

    // Example of additional methods
    async show(req: Request, res: Response) {
        try {
          
            const dette = await app.prisma.dette.findMany({
                select: {
                    id: true,
                    montant: true,
                    client: {
                        select: {
                            nom: true,
                            prenom: true,
                            email: true
                        }
                    },
                    detail: {
                        select: {
                            articleId: true,
                            qteVente: true,
                            prixVente: true
                        }
                    }
                }
            });
            res.status(StatusCodes.OK).send(
                RestResponse.response(dette, StatusCodes.OK)
            );
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
                RestResponse.response(
                    { message: "Erreur lors de la récupération de la dette.", error: (error as Error).message },
                    StatusCodes.INTERNAL_SERVER_ERROR
                )
            );
        }
    }
  async  filterBy(req: Request, res: Response){
        try {
            const dettes = await app.prisma.dette.findMany({
                where: {
                    status: true,  // Fetch only dettes where the status is true
                },
                include: {
                    client: true,
                    detail: true,
                    paiements: true,
                }
            });
    
            res.status(StatusCodes.OK).send({
                status: StatusCodes.OK,
                data: dettes,
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Erreur lors du traitement",
            });
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const updatedDette = await app.prisma.dette.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    montant: req.body.montant,
                    // Add other fields to be updated here
                },
            });
        }catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Erreur lors de la récupération de la dette",
                error: (error as Error).message,
            });
        }
    }
    
    // Other methods can be defined similarly
}

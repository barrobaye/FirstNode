import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from '@prisma/client';
import app from "../app";

export default class DetteController {
    async store(req: Request, res: Response) {
        try {
            const details = req.body.detail;
            // Validate that the detail array exists and contains at least one item
          
            // Ensure that detail exists and is an array
            if (!details || !Array.isArray(details) || details.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST)
                    .send({
                        status: StatusCodes.BAD_REQUEST,
                        message: "Détails manquants ou format incorrect.",
                    });
            }
    
            // Check if every detail item contains a valid articleId
            for (const detail of details) {
                const articleId = detail.articleId;
                if (!articleId) {
                    return res.status(StatusCodes.NOT_FOUND)
                        .send({
                            status: StatusCodes.NOT_FOUND,
                            message: "Chaque élément de détail doit contenir un articleId valide.",
                        });
                }
    
                // Verify if the articleId exists in the database
                const articleExists = await app.prisma.article.findUnique({
                    where: { id: articleId },
                });
    
                if (!articleExists) {
                    return res.status(StatusCodes.NOT_FOUND)
                        .send({
                            status: StatusCodes.NOT_FOUND,
                            message: `L'article avec l'ID ${articleId} n'existe pas.`,
                        });
                }
            } 

            const newDette = await app.prisma.$transaction(async (tx:Prisma.TransactionClient) => {
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
                            create: (req.body.detail as Array<{ articleId: number; qteVente: number; prixVente: number; }>).map((detail) => ({
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
                await Promise.all(
                    createdDette.detail.map(async (detail: any) => {
                        await tx.article.update({
                            where: {
                                id: detail.article.id,
                            },
                            data: {
                                quantiteStock: detail.article.quantiteStock - detail.qteVente,
                            },
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
                message: "Erreur lors de la création de la dette",
                error: (error as Error).message,
            });
        }
    };
    

    // Example of additional methods
    async show(req: Request, res: Response) {
        try {
            const dette = await app.prisma.dette.findUnique({
                where: { id: Number(req.params.id) },
                include: { detail: true, client: true }
            });
            if (!dette) {
                return res.status(StatusCodes.NOT_FOUND).send({
                    status: StatusCodes.NOT_FOUND,
                    message: "la Dette n'exste pas",
                });
            }
            res.status(StatusCodes.OK).send(dette);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Erreur lors de la récupération de la dette",
                error: (error as Error).message,
            });
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

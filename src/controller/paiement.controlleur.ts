import { Request, Response } from "express";
import Controller from "../core/impl/controller";
    import { StatusCodes } from "http-status-codes";
import app from "../app";
import RestResponse from "../core/response";
import { Prisma } from "@prisma/client";


export default class PaiementController extends Controller{
    
    async store(req: Request, res: Response) {
        try {
            const { detteId, montantVerser } = req.body;
            const result = await app.prisma.$transaction(async (tx:Prisma.TransactionClient) => {
                // Vérifier si cette dette existe
                const dette = await tx.dette.findUnique({
                    where: { id: Number(detteId) },
                    include: { paiements: true },
                });
    
                if (!dette) {
                    return res.status(StatusCodes.NOT_FOUND).send(
                        RestResponse.response(null, StatusCodes.NOT_FOUND, "Cette dette n'existe pas")
                    );
                }
    
                // Calculer le montant restant après le paiement
                const totalPaid = dette.paiements.reduce((sum: number, p: { montantVerser: number }) => sum + p.montantVerser, 0);
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
    
            res.status(StatusCodes.OK)
                .send(RestResponse.response(result, StatusCodes.OK, "Paiement créé avec succès"));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors du traitement"));
        }
    }
   async show(req: Request, res: Response) {
        try {
            const data = await app.prisma.paiement.findMany({
                select: {
                    id: true,
                    detteId: true,
                    montantVerser: true,
                    montantRest: true,
                   // correction ici
                }
            });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(data, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }


    
    }
   
    async edit(req: Request, res: Response) {
        try {
            const paiement = await app.prisma.paiement.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    id: true,
                    montantVerser:true,
                    montantRest:true,
                   dette:{
                    select:{
                        client:{
                            select:{
                                nom:true,
                                prenom:true,
                                telephone:true
                        }
                   }
                }
            }
        }
    });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(paiement, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }
    }
}
   




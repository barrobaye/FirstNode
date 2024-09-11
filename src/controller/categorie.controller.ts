import app from "../app";
import Controller from "../core/impl/controller";
import { Request, Response } from "express";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";


export default class CategorieController extends Controller{

    async store(req: Request, res: Response) {
        try {
            const newData = await app.prisma.categorie.create({
                data:{
                    libelle:req.body.libelle,
                }
            });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(newData, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.NOT_FOUND)
                .send(RestResponse.response(error, StatusCodes.OK, "Erreur lors du traitement"));
        }
    }
    
    async show(req: Request, res: Response) {
        try {
            const data = await app.prisma.categorie.findMany({
                select: {
                    id:true,
                    libelle: true,
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
    // Supprimer un article
async remove(req: Request, res: Response) {
    try {
        const deletedCategorie = await app.prisma.categorie.delete({
            where: { id: Number.parseInt(req.params.id) },
        });
        res.status(StatusCodes.OK)
            .send(RestResponse.response(deletedCategorie, StatusCodes.OK,"Supprimer avec succée"));
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)   
            .send(RestResponse.response(error, StatusCodes.NOT_FOUND, "Erreur lors de la suppression de categorie"));
    }
}

}
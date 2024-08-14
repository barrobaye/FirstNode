import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import { StatusCodes } from "http-status-codes";
import RestResponse from "../core/response";
import app from "../app";

export default class ArticleController extends Controller{
    
// Remplacez createAt par createdAt
async store(req: Request, res: Response) {
    try {
        const newData = await app.prisma.article.create({
            data:{
                libelle:req.body.libelle,
                prix:req.body.prix,
                quantiteStock:req.body.quantiteStock
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
        const data = await app.prisma.article.findMany({
            select: {
                id: true,
                libelle: true,
                prix: true,
                quantiteStock: true,
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
        const data = await app.prisma.article.findFirstOrThrow({
            where: { id: Number.parseInt(req.params.id) },
            select: {
                id: true,
                libelle: true,
                prix: true,
                quantiteStock: true,
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
}

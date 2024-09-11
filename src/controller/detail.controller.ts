import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Controller from "../core/impl/controller";
import RestResponse from "../core/response";
import app from "../app";


export default class DetailController extends Controller{
    
    // Remplacez createAt par createdAt
    async store(req: Request, res: Response) {
        try {
            const newData = await app.prisma.detail.create({
               
            });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(newData, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.NOT_FOUND)
                .send(RestResponse.response(error, StatusCodes.OK, "Erreur lors du traitement"));
        }
    }
    
    async show(req: Request, res: Response) {
        try{
            const data = await app.prisma.detail.findMany({
                select: {
                    articleId:true,
                    prixVente:true,
                    qteVente:true
                }
            });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(data, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.OK, "Erreur lors de la récupération des donnée"));
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const data = await app.prisma.detail.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    articleId:true,
                    prixVente:true,
                    qteVente:true
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
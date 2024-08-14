import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";
import app from "../app";

export default class DetteController extends Controller{
  async  store(req: Request, res: Response){
    try {
       // Check if client exists
       const client = await app.prisma.client.findUnique({
        where: { id: Number.parseInt(req.body.clientId) },
    });

    if (!client) {
        return res.status(StatusCodes.NOT_FOUND).send(
            RestResponse.response(null, StatusCodes.NOT_FOUND, "Le Client n'existe pas")
        );
      
    } 
   
       // Check if article exists
       const article = await app.prisma.article.findUnique({
        where: { id: Number.parseInt(req.body.detail.articleId) },
    });
    if (!article) {
        return res.status(StatusCodes.NOT_FOUND).send(
            RestResponse.response(null, StatusCodes.NOT_FOUND, "article n'existe pas")
        );
    } 
      const newData = await app.prisma.$transaction(async (tx) => {
          // Create Dette
          const newDette = await tx.dette.create({
              data: {
                  montant: req.body.montant,
                  client: {
                      connect: {
                          id: Number.parseInt(req.body.clientId),
                      },
                  },
                  detail: {
                      create: req.body.detail.map((detail: any) => ({
                          articleId: detail.articleId, // Ensure the detail has articleId
                          prixVente: detail.prixVente,
                          qteVente: detail.qteVente,
                      })),
                  },
              },
              include: {
                  detail: {
                      select: {
                          article: {
                              select: {
                                  libelle:true,
                                  id: true,
                                  quantiteStock: true,
                              },
                          },
                          qteVente: true,
                      },
                  },
              },
          });
          // Update Article Quantities
          await Promise.all(newDette.detail.map(async (detail) => {
              await tx.article.update({
                  where: { id: detail.article.id },
                  data: {
                      quantiteStock: detail.article.quantiteStock - detail.qteVente,
                  },
              });
          }));
          // Get Data After Transaction
          return tx.dette.findFirst({
              where: { id: newDette.id },
              select: {
                  montant:true,
                  client: true,
                  detail: {
                      select: {
                          article: true,
                          qteVente: true,
                          prixVente: true,
                      },
                  },
              },
          });
      });
  
      res.status(StatusCodes.OK).send(RestResponse.response(newData, StatusCodes.OK));
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
  }  
    async show(req: Request, res: Response) {
        try {
            const data = await app.prisma.dette.findMany({
                
            });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(data, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }
       }
}
    
 
   


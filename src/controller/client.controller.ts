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
                .send(RestResponse.response({ client: newClient}, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.OK)
                .send(RestResponse.response(error, StatusCodes.OK));
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
    }
    



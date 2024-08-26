import app from "../app";
import { StatusCodes } from "http-status-codes";
import Controller from "../core/impl/controller";
import { Request, Response } from "express";
import RestResponse from "../core/response";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { encrypt } from "../helper/encrypt";

export default class UserController extends Controller {

    async store(req: Request, res: Response) {

        try {
            const newClient = await app.prisma.user.create({
                data: {
                    email:req.body.email,
                    password: await encrypt.encryptepass(req.body.password),
                    role:req.body.role
                }
             
                
            }) 
            res.status(StatusCodes.OK)
                .send(RestResponse.response({ client: newClient}, StatusCodes.OK));
        } catch (error) {
            console.error("Error Details:", error);
        
            if (error instanceof PrismaClientValidationError) {
                console.error("Prisma Validation Error:", error.message);
            } else {
                console.error("Unexpected Error:", error);
            }
        
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors du traitement"));
        }
    } 
        async show(req: Request, res: Response) {
    
    }    
    edit(req: Request, res: Response): void {
            
        }

    }
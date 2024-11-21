import app from "../app";
import { StatusCodes } from "http-status-codes";
import Controller from "../core/impl/controller";
import { Request, Response } from "express";
import RestResponse from "../core/response";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { encrypt } from "../helper/encrypt";
import { Role } from "@prisma/client";

export default class UserController extends Controller {

    async store(req: Request, res: Response) {
        try {
            // Extraire les données de la requête
            const { email, password, role, telephone ,clientId } = req.body;
    
            // Normaliser le rôle si fourni
            let assignedRole = "CLIENT" ; // Par défaut : CLIENT
            if (role) {
                const normalizedRole = role.trim().toUpperCase() as Role;
                if (!Object.values(Role).includes(normalizedRole)) {
                    return res.status(StatusCodes.BAD_REQUEST).send(
                        RestResponse.response(
                            null,
                            StatusCodes.BAD_REQUEST,
                            `Le rôle fourni (${role}) n'est pas valide. Les rôles valides sont : ${Object.values(Role).join(", ")}`
                        )
                    );
                }
                assignedRole = normalizedRole;
            }
    
            // Créer un nouvel utilisateur avec les informations fournies
            const newUser = await app.prisma.user.create({
                data: {
                    email: email,
                    password: await encrypt.encryptepass(password),
                    role: assignedRole, 
                    clientId,telephone
                },
            });
    
            res.status(StatusCodes.OK).send(
                RestResponse.response({ client: newUser }, StatusCodes.OK)
            );
        } catch (error) {
            console.error("Error Details:", error);
    
            if (error instanceof PrismaClientValidationError) {
                console.error("Prisma Validation Error:", error.message);
            } else {
                console.error("Unexpected Error:", error);
            }
    
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
                RestResponse.response(
                    null,
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    "Erreur lors du traitement"
                )
            );
        }
    }
        async show(req: Request, res: Response) {
            try {
                const Users = await app.prisma.user.findMany({
                  select:{
                    id: true,
                    email: true,
                    role: true,
                    client:{
                        select:{
                            nom:true,
                            prenom:true,
                            telephone: true  
                        }
                    },
                    telephone: true
                  }     
                }) 
                res.status(StatusCodes.OK)
                    .send(RestResponse.response({ users: Users}, StatusCodes.OK));
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
        async edit(req: Request, res: Response){
        try {
            const users = await app.prisma.user.findFirstOrThrow({
                where: { id: Number.parseInt(req.params.id) },
                select: {
                    role: true,
                    telephone: true,
                }
            });
            res.status(StatusCodes.OK)
                .send(RestResponse.response(users, StatusCodes.OK));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
        }     
        }

    }
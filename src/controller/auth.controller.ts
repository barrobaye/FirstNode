import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import app from "../app";
import { encrypt } from "../helper/encrypt";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import RestResponse from "../core/response";
import { date, ZodDate } from "zod";
import { AuthRequest } from "../middleware/auth.middlevare";

export default class AuthController{

    
    async login (req: Request, res: Response){
        try {
            // Log email and password for debugging
           // console.log("Email:", req.body.email);
            //console.log("Password:", req.body.password);
    
            const user = await app.prisma.user.findUnique({
                where: { email: req.body.email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    role: true,
                    client: {
                        select: {
                            nom: true,
                            prenom: true,
                            telephone: true
                        }
                    }
                }
            });
    
            // Log the user object for debugging
           // console.log("Retrieved User:", user);
    
            if (user && bcrypt.compareSync(req.body.password, user.password)) {
                // If this works, the issue might be with the implementation of encrypt.comparepassword
                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    process.env.JWT_SECRET as string,
                    { expiresIn: '1h' }
                );
            
                return res.status(StatusCodes.OK).send({
                    token: token
                });
            } else {
                console.log('Password does not match');
            }
    
            return res.status(StatusCodes.UNAUTHORIZED).send({
                status: StatusCodes.UNAUTHORIZED,
                data: null,
                message: "email ou password incorrecte"
            });
    
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                data: error,
                message: "Erreur lors du traitement"
            });
        }

}
// async register(req: AuthRequest, res: Response) {
//     try {
//         const { email, password, clientId } = req.body;

//         // Find the client by ID
//         const client = await app.prisma.client.findUnique({
//             where: { id: Number.parseInt(clientId) },
//         });

//         if (!client) {
//             return res.status(StatusCodes.NOT_FOUND).send(
//                 RestResponse.response(null, StatusCodes.NOT_FOUND, "Le Client n'existe pas")
//             );
//         }

//         // Create the new user with a default role
//         const newUser = await app.prisma.user.create({
//             data: {
//                 email,
//                 password: await encrypt.encryptepass(password),
//                 role: 'ADMIN',  // Set a default role
//                 client: {
//                     connect: { id: client.id }
//                 }
//             },
//         });

//         res.status(StatusCodes.CREATED).send(
//             RestResponse.response(newUser, StatusCodes.CREATED, "Utilisateur créé avec succès.")
//         );
//     } catch (error) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
//             RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors de la création de l'utilisateur.")
//         );
//     }
// }


async register (req: AuthRequest, res: Response){
    try {
        const { email, password, clientId, role } = req.body;

        // Find the client by ID
        const client = await app.prisma.client.findUnique({
            where: { id: Number.parseInt(clientId) },
        });

        if (!client) {
            return res.status(StatusCodes.NOT_FOUND).send(
                RestResponse.response(null, StatusCodes.NOT_FOUND, "Le Client n'existe pas")
            );
        }

        // Check if the authenticated user is an admin
        const userRole = req.user?.role;
        if (userRole !== 'ADMIN' && role) {
            return res.status(StatusCodes.FORBIDDEN).send(
                RestResponse.response(null, StatusCodes.FORBIDDEN, "Seul un administrateur peut définir le rôle.")
            );
        }

        // If the user is an admin, set the role; otherwise, default to 'CLIENT'
        const newUserRole = userRole === 'ADMIN' && role ? role : 'CLIENT';

        // Create the new user
        const newUser = await app.prisma.user.create({
            data: {
                email,
                password: await encrypt.encryptepass(password),
                role: newUserRole,
                client: {
                    connect: { id: client.id }
                }
            },
        });

        res.status(StatusCodes.CREATED).send(
            RestResponse.response(newUser, StatusCodes.CREATED, "Utilisateur créé avec succès.")
        );
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors de la création de l'utilisateur.")
        );
    }
}
async logout (req: Request, res: Response){
}

}
   // const token = encrypt.generateToken({id:user.id, email:user.email},'300s')
            //     return res.status(StatusCodes.OK).send({
            //     "token": token
            //     })
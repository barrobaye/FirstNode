import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import app from "../app";
import { encrypt } from "../helper/encrypt";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import RestResponse from "../core/response";
import { date, ZodDate } from "zod";

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
async register (req: Request, res: Response){
    try {
     //   const newUser = await app.prisma.$transaction(async(tx) => {
            const hashPassword = await encrypt.encryptepass(req.body.password)
            const user = await app.prisma.user.create({
                data:{
                    email:req.body.email,
                    password:hashPassword,
                    clientId:req.body.clientId
                }
        })
        res.status(StatusCodes.OK)
        .send(RestResponse.response(user, StatusCodes.OK));
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(RestResponse.response(error, StatusCodes.OK));    
    }
}
async logout (req: Request, res: Response){
}

}
   // const token = encrypt.generateToken({id:user.id, email:user.email},'300s')
            //     return res.status(StatusCodes.OK).send({
            //     "token": token
            //     })
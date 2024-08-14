import { NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import RestResponse from "../../core/response";



interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}
export const authentificated = () : RequestHandler => {
  const {JWT_SECRET} = process.env;
  return async (req,res,next) =>{ 
    const token  = req.header('Authorization')?.replace('Bearer ','');
    if(!token) {return res.status(StatusCodes.UNAUTHORIZED).send(RestResponse.response(null,StatusCodes.UNAUTHORIZED.valueOf(),"No Token provided"))};
    jwt.verify(token,`${JWT_SECRET}`,(err,user) =>{
      if(err) {return res.status(StatusCodes.UNAUTHORIZED).send(RestResponse.response(null,StatusCodes.UNAUTHORIZED.valueOf(),"Invalid Token"))};
      req.body.user = user;
      next();
    })
  }
}
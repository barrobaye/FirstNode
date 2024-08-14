import { NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import app from "../app";
import RestResponse from "../core/response";


interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}
export const authMiddleware = (roles: string[] = []) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
              status: StatusCodes.UNAUTHORIZED,
              message: "Access denied. No token provided."
          });
      }

      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number, email: string, role: string };
          const user = await app.prisma.user.findUnique({ where: { id: decoded.id } });

          if (!user || (roles.length && !roles.includes(user.role))) {
              return res.status(StatusCodes.FORBIDDEN).send({
                  status: StatusCodes.FORBIDDEN,
                  message: "Access denied. Insufficient permissions."
              });
          }

          req.user = { id: user.id, role: user.role }
          next();
      } catch (error) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
              status: StatusCodes.UNAUTHORIZED,
              message: "Invalid Token"
          });
      }
  };
};

export const authorization = (roles:string[]):RequestHandler => {
return async (req,res,next) =>{
  const {role} = req.body.user
  if(!role.includes(role)){
    return res.status(StatusCodes.UNAUTHORIZED).send(RestResponse.response(null, StatusCodes.UNAUTHORIZED.valueOf(),'forbidden'));
  }
  next();
}

};

// export const authMiddleware = (roles: string[] = []) => {
//   return async (req: AuthRequest, res: Response, next: NextFunction) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//       return res.status(StatusCodes.UNAUTHORIZED).send({
//         status: StatusCodes.UNAUTHORIZED,
//         message: "Access denied. No token provided."
//       });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number, role: string };
//       const user = await app.prisma.user.findUnique({ where: { id: decoded.userId } });

//       if (!user || (roles.length && !roles.includes(user.role))) {
//         return res.status(StatusCodes.FORBIDDEN).send({
//           status: StatusCodes.FORBIDDEN,
//           message: "Access denied. Insufficient permissions."
//         });
//       }

//       req.user = { id: user.id, role: user.role };
//       next();
//     } catch (error) {
//       return res.status(StatusCodes.UNAUTHORIZED).send({
//         status: StatusCodes.UNAUTHORIZED,
//         message: "Invalid token."
//       });
//     }
//   };
// };

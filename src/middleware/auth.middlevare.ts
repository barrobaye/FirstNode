import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.config";
import { StatusCodes } from "http-status-codes";

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
      return res.status(StatusCodes.UNAUTHORIZED)
        .send("Access denied. No token provided.");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number, role: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(StatusCodes.FORBIDDEN)
          .send("Access denied. Insufficient permissions.");
      }

      req.user = { id: user.id, role: user.role };  // Correctly assigning user to req
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED)
        .send("Invalid token.");
    }
  };
};

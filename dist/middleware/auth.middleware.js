"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_model_1 = __importDefault(require("../core/impl/prisma.model"));
const http_status_codes_1 = require("http-status-codes");
const authMiddleware = (roles = []) => {
    return async (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .send("Access denied. No token provided.");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await prisma_model_1.default.user.findUnique({ where: { id: decoded.userId } });
            if (!user || (roles.length && !roles.includes(user.role))) {
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN)
                    .send("Access denied. Insufficient permissions.");
            }
            req.user = { id: user.id, role: user.role }; // Correctly assigning user to req
            next();
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .send("Invalid token.");
        }
    };
};
exports.authMiddleware = authMiddleware;

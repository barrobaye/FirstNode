"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.authMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../app"));
const response_1 = __importDefault(require("../core/response"));
const authMiddleware = (roles = []) => {
    return async (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: "Access denied. No token provided.",
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await app_1.default.prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user || (roles.length && !roles.includes(user.role))) {
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send({
                    status: http_status_codes_1.StatusCodes.FORBIDDEN,
                    message: "Access denied. Insufficient permissions.",
                });
            }
            req.user = { id: user.id, role: user.role };
            next();
        }
        catch (error) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: "Invalid Token",
            });
        }
    };
};
exports.authMiddleware = authMiddleware;
const authorization = (roles) => {
    return async (req, res, next) => {
        const { role } = req.user; // Using the extended `AuthRequest` interface
        if (!roles.includes(role)) {
            return res
                .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                .send(response_1.default.response(null, http_status_codes_1.StatusCodes.FORBIDDEN.valueOf(), "Forbidden"));
        }
        next();
    };
};
exports.authorization = authorization;

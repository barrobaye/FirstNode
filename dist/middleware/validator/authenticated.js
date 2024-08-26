"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentificated = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = __importDefault(require("../../core/response"));
const authentificated = () => {
    const { JWT_SECRET } = process.env;
    return async (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(response_1.default.response(null, http_status_codes_1.StatusCodes.UNAUTHORIZED.valueOf(), "No Token provided"));
        }
        ;
        jsonwebtoken_1.default.verify(token, `${JWT_SECRET}`, (err, user) => {
            if (err) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(response_1.default.response(null, http_status_codes_1.StatusCodes.UNAUTHORIZED.valueOf(), "Invalid Token"));
            }
            ;
            req.body.user = user;
            next();
        });
    };
};
exports.authentificated = authentificated;

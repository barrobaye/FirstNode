"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_validator_1 = require("./response.validator");
const article_shema_1 = require("./validator/article.shema");
const client_shema_1 = require("./validator/client.shema");
const http_status_codes_1 = require("http-status-codes");
const response_1 = __importDefault(require("../core/response"));
const zod_1 = require("zod");
const user_shema_1 = require("./validator/user.shema");
const dette_shema_1 = require("./validator/dette.shema");
const paiement_shema_1 = require("./validator/paiement.shema");
const shema = {
    "post/api/v1/clients": client_shema_1.clientPostShema,
    "post/api/v1/article": article_shema_1.articlePostShema,
    "post/api/v1/auth": user_shema_1.userPostShema,
    "post/api/v1/dette": dette_shema_1.dettePostShema,
    "post/api/v1/users": user_shema_1.userPostShema,
    "post/api/v1/paiement": paiement_shema_1.paiementPostShema
};
const ValidatorShema = () => {
    return async (req, res, next) => {
        //Methode de la requête 
        const method = req.method.toLowerCase();
        if (!response_validator_1.supportedMethods.includes(method)) {
            return next();
        }
        try {
            //Validation
            const schemaKey = `${method}${req.originalUrl}`;
            const shemas = shema[schemaKey];
            await shemas.parseAsync(req.body);
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const reponseValidator = {
                    errors: error.errors.map((issue) => ({
                        message: `${issue.path.join('.')} ${issue.message}`,
                    })),
                    status: false
                };
                return res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).send(response_1.default.response(reponseValidator, http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY.valueOf()));
            }
        }
    };
};
exports.default = ValidatorShema;

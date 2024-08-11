"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_validator_1 = require("./response.validator");
const article_shema_1 = require("./validator/article.shema");
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
const response_1 = __importDefault(require("../core/response"));
const ValidatorArticle = () => {
    return async (req, res, next) => {
        //Methode de la requête 
        const method = req.method.toLowerCase();
        if (!response_validator_1.supportedMethods.includes(method)) {
            return next();
        }
        try {
            await article_shema_1.articlePostShema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const reponseValidator = {
                    errors: error.errors.map((issue) => ({
                        message: "${issue.path.join('.')} is ${issue.message}"
                    })),
                    status: false
                };
                return res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).send(response_1.default.response(reponseValidator, http_status_codes_1.StatusCodes.CONFLICT));
            }
        }
    };
};
exports.default = ValidatorArticle;

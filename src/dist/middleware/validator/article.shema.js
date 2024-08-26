"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlePostShema = exports.verifieLibelle = void 0;
const zod_1 = require("zod");
const prisma_model_1 = __importDefault(require("../../core/impl/prisma.model"));
const verifieLibelle = async (value) => {
    const count = await prisma_model_1.default.article.count({
        where: {
            libelle: value
        }
    });
    return count > 1;
};
exports.verifieLibelle = verifieLibelle;
exports.articlePostShema = zod_1.z.object({
    libelle: zod_1.z.string({
        required_error: "libelle obligatoire"
    }).min(3).max(30, "libelle must be least 5 charactere")
        .refine(exports.verifieLibelle, "libelle exist déja"),
    prix: zod_1.z.number().positive({
        message: "le prix doit être positive"
    }),
    quantiteStock: zod_1.z.number().positive({
        message: "la quantité doit être positive"
    }),
});

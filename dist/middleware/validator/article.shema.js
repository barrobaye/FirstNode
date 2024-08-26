"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlePostShema = exports.verifieLibelle = void 0;
const zod_1 = require("zod");
const app_1 = __importDefault(require("../../app"));
const verifieLibelle = async (value) => {
    const count = await app_1.default.prisma.article.count({
        where: {
            libelle: value
        }
    });
    return count === 0;
};
exports.verifieLibelle = verifieLibelle;
exports.articlePostShema = zod_1.z.object({
    libelle: zod_1.z.string({
        required_error: "Libellé obligatoire"
    })
        .min(3, "Le libellé doit contenir au moins 3 caractères")
        .max(30, "Le libellé ne doit pas dépasser 30 caractères")
        .refine(async (libelle) => await (0, exports.verifieLibelle)(libelle), {
        message: "Ce libellé existe déjà. Veuillez en choisir un autre."
    }),
    prix: zod_1.z.number().positive({
        message: "Le prix doit être positif"
    }),
    quantiteStock: zod_1.z.number().positive({
        message: "La quantité doit être positive"
    }),
});

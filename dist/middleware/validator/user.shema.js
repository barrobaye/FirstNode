"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPostShema = exports.verifieLibelle = void 0;
const zod_1 = require("zod");
const app_1 = __importDefault(require("../../app"));
const verifieLibelle = async (value) => {
    const count = await app_1.default.prisma.user.findUnique({
        where: {
            email: value
        }
    });
    return true;
};
exports.verifieLibelle = verifieLibelle;
exports.userPostShema = zod_1.z.object({
    email: zod_1.z.string().email()
        .min(3, "Le email doit contenir au moins 3 caractères")
        .max(20, "Le email ne doit pas dépasser 30 caractères")
        .refine(async (email) => await (0, exports.verifieLibelle)(email), {
        message: "Ce email existe déjà. Veuillez en choisir un autre."
    }),
    password: zod_1.z.string().min(5),
    role: zod_1.z.enum(['ADMIN', 'BOUTIQUIER', 'CLIENT']),
});

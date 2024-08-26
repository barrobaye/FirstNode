"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientPostShema = exports.verifieLibelle = void 0;
const zod_1 = require("zod");
const app_1 = __importDefault(require("../../app"));
const verifieLibelle = async (value) => {
    const count = await app_1.default.prisma.client.count({
        where: {
            telephone: value
        }
    });
    return count === 0;
};
exports.verifieLibelle = verifieLibelle;
exports.clientPostShema = zod_1.z.object({
    nom: zod_1.z.string({
        required_error: "nom obligatoire"
    }).min(3).max(30, "nom must be least 5 charactere"),
    prenom: zod_1.z.string({
        required_error: "prenom obligatoire"
    }).min(3).max(30, "prenom must be least 5 charactere"),
    telephone: zod_1.z.string({
        required_error: "telephone obligatoire"
    }).min(3).max(30, "telephone must be least 5 charactere")
        .refine(async (telephone) => await (0, exports.verifieLibelle)(telephone), {
        message: "Ce numéro de téléphone appartient déja a un client Veuillez en choisir un autre."
    })
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientPostShema = void 0;
const zod_1 = require("zod");
exports.clientPostShema = zod_1.z.object({
    nom: zod_1.z.string({
        required_error: "nom obligatoire"
    }).min(3).max(30, "nom must be least 5 charactere"),
    prenom: zod_1.z.string({
        required_error: "prenom obligatoire"
    }).min(3).max(30, "prenom must be least 5 charactere"),
    telephone: zod_1.z.string({
        required_error: "telephone obligatoire"
    }).min(3).max(30, "telephone must be least 5 charactere"),
});

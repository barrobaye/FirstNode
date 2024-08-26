"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paiementPostShema = void 0;
const zod_1 = require("zod");
exports.paiementPostShema = zod_1.z.object({
    clientId: zod_1.z.number().positive({
        message: "Id doit exister"
    }),
    montantVerser: zod_1.z.number().positive({
        message: "montant doit être obligatoire et doit être possitif"
    }),
});

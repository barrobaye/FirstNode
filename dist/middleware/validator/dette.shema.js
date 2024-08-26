"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dettePostShema = void 0;
const zod_1 = require("zod");
// export const verifieLibelle = async (value: int): Promise<boolean> => {
//     const count = await app.prisma.dette.count({
//         where: {
//             clientId: value
//         }
//     });
//     return count === 0;
// };
exports.dettePostShema = zod_1.z.object({
    montant: zod_1.z.number().positive({
        message: "Libellé obligatoire et doit être possitif"
    }),
    clientId: zod_1.z.number().positive({
        message: "Id doit exister"
    }),
});

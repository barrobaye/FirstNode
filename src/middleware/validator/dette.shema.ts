import { z } from "zod";
import app from "../../app";


// export const verifieLibelle = async (value: int): Promise<boolean> => {
//     const count = await app.prisma.dette.count({
//         where: {
//             clientId: value
//         }
//     });
//     return count === 0;
// };

export const dettePostShema = z.object({
    montant: z.number().positive({
        message: "Libellé obligatoire et doit être possitif"
    }),
  
    clientId: z.number().positive({
        message: "Id doit exister"
       
    }),
});

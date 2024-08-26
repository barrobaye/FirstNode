import { z } from "zod";
import app from "../../app";



export const paiementPostShema = z.object({

    clientId: z.number().positive({
        message: "Id doit exister"
       
    }),
    montantVerser: z.number().positive({
        message: "montant doit être obligatoire et doit être possitif"
    }),
  
});

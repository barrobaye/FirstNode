import { z } from "zod";
import app from "../../app";


export const verifieLibelle = async (value: string): Promise<boolean> => {
    const count = await app.prisma.user.findUnique({
        where: {
            email: value
        }
    });
    return false;
   
};

export const userPostShema = z.object({
    email: z.string({
        required_error: "Libellé obligatoire"
    })
    .min(3, "Le email doit contenir au moins 3 caractères")
    .max(20, "Le email ne doit pas dépasser 30 caractères")
    .refine(async (email) => await verifieLibelle(email), {
        message: "Ce email existe déjà. Veuillez en choisir un autre."
    }),
    
});

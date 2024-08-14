import { z } from "zod";
import app from "../../app";
export const verifieLibelle = async (value: string): Promise<boolean> => {
    const count = await app.prisma.client.count({
        where: {
            telephone: value
        }
    });
    return count === 0;
};

export const clientPostShema = z.object({
    nom: z.string ({
        required_error:"nom obligatoire"

    }).min(3).max(30, "nom must be least 5 charactere"),
    prenom: z.string ({
        required_error:"prenom obligatoire"

    }).min(3).max(30, "prenom must be least 5 charactere"),
    telephone: z.string ({
        required_error:"telephone obligatoire"

    }).min(3).max(30, "telephone must be least 5 charactere")
    .refine(async (telephone) => await verifieLibelle(telephone), {
        message: "Ce numéro de téléphone appartient déja a un client Veuillez en choisir un autre."  
    })
})
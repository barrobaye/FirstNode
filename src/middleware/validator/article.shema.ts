import { z } from "zod";
import app from "../../app";


export const verifieLibelle = async (value: string): Promise<boolean> => {
    const count = await app.prisma.article.count({
        where: {
            libelle: value
        }
    });
    return count === 0;
};

export const articlePostShema = z.object({
    libelle: z.string({
        required_error: "Libellé obligatoire"
    })
    .min(3, "Le libellé doit contenir au moins 3 caractères")
    .max(30, "Le libellé ne doit pas dépasser 30 caractères")
    .refine(async (libelle) => await verifieLibelle(libelle), {
        message: "Ce libellé existe déjà. Veuillez en choisir un autre."
    }),
    prix: z.number().positive({
        message: "Le prix doit être positif"
    }),
    quantiteStock: z.number().positive({
        message: "La quantité doit être positive"
    }),
});

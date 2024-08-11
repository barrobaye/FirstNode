import { z } from "zod";
import app from "../../app";


export const verifieLibelle = async(value:string)=>{
    const count = await app.prisma.article.count({
        where:{
            libelle:value
        }
    })
    return count > 1
};
export const articlePostShema = z.object({
    libelle: z.string ({
        required_error:"libelle obligatoire"

    }).min(3).max(30, "libelle must be least 5 charactere")
    .refine(verifieLibelle,"libelle exist déja"),
    prix: z.number().positive({
        message:"le prix doit être positive"
    }),
    quantiteStock: z.number().positive({
        message:"la quantité doit être positive"
    }),

})
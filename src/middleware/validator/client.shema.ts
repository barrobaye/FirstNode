import { z } from "zod";


export const clientPostShema = z.object({
    nom: z.string ({
        required_error:"nom obligatoire"

    }).min(3).max(30, "nom must be least 5 charactere"),
    prenom: z.string ({
        required_error:"prenom obligatoire"

    }).min(3).max(30, "prenom must be least 5 charactere"),
    telephone: z.string ({
        required_error:"telephone obligatoire"

    }).min(3).max(30, "telephone must be least 5 charactere"),  
})
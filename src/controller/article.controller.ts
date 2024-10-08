import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import { StatusCodes } from "http-status-codes";
import RestResponse from "../core/response";
import app from "../app";

export default class ArticleController extends Controller{
    
    async store(req: Request, res: Response) {
        try {
            // Ensure category exists before creating an article
            const category = await app.prisma.categorie.findUnique({
                where: { id: req.body.categoriId },
            });
            if (!category) {
                return res.status(StatusCodes.BAD_REQUEST)
                    .send(RestResponse.response(null, StatusCodes.BAD_REQUEST, "Catégorie invalide"));
            }
    
            const newData = await app.prisma.article.create({
                data: {
                    libelle: req.body.libelle.toLowerCase(), // Convert to lowercase
                    prix: req.body.prix,
                    quantiteStock: req.body.quantiteStock,
                    categoriId: req.body.categoriId,  // Add category if present
                }
            });
            return res.status(StatusCodes.CREATED)
                .send(RestResponse.response(newData, StatusCodes.CREATED));
        } catch (error) {
            console.error("Erreur lors de la création de l'article:", error);
            return res.status(StatusCodes.BAD_REQUEST)
                .send(RestResponse.response(error, StatusCodes.BAD_REQUEST, "Erreur lors du traitement"));
        }
    }

// Récupérer tous les articles
async show(req: Request, res: Response) {
    try {
        const data = await app.prisma.article.findMany({
            select: {
                id: true,
                libelle: true,
                prix: true,
                quantiteStock: true,
                categorie: {   // Inclure les informations sur la catégorie
                    select: {
                        libelle: true  // Supposant que `libelle` est un champ dans le modèle `Categorie`
                    }
                },
            }
        });
        res.status(StatusCodes.OK)
            .send(RestResponse.response(data, StatusCodes.OK));
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
    }
}

// Récupérer un article par son ID
async edit(req: Request, res: Response) {
    try {
        const data = await app.prisma.article.findFirstOrThrow({
            where: { id: Number.parseInt(req.params.id) },
            select: {
                id: true,
                libelle: true,
                prix: true,
                quantiteStock: true,
                categorie: {  // Inclure les informations sur la catégorie
                    select: {
                        libelle: true
                    }
                },
            }
        });
        res.status(StatusCodes.OK)
            .send(RestResponse.response(data, StatusCodes.OK));
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(error, StatusCodes.NOT_FOUND));
    }
}
async findByLibelle(req: Request, res: Response) {
    try {
        const searchLibelle = req.body.libelle.toLowerCase();  // Convertir en lowercase pour la recherche
        const data = await app.prisma.article.findMany({
            where: {
                libelle: {
                    equals: searchLibelle,   // Comparer avec le libelle en lowercase
                    mode: 'insensitive'      // Comparaison insensible à la casse
                }
            },
            select: {
                id: true,
                libelle: true,
                prix: true,
                quantiteStock: true,
                categorie: {
                    select: {
                        libelle: true
                    }
                }
            }
        });

        if (data.length > 0) {
            res.status(StatusCodes.OK)
                .send(RestResponse.response(data, StatusCodes.OK));
        } else {
            res.status(StatusCodes.NOT_FOUND)
                .send(RestResponse.response(null, StatusCodes.NOT_FOUND, "Aucun article trouvé avec ce libellé"));
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

// Mettre à jour un article
async update(req: Request, res: Response): Promise<void> {
    const updates = req.body; // Supposons que vous envoyez un tableau d'objets avec {id, data}
    try {
        // Vérifiez que le corps contient un tableau
        if (!Array.isArray(updates)) {
            res.status(StatusCodes.BAD_REQUEST)
                .send(RestResponse.response(null, StatusCodes.BAD_REQUEST, "Le corps de la requête doit être un tableau."));
            return;
        }

        // Mettez à jour chaque article
        const updatedArticles = await Promise.all(
            updates.map(async (update) => {
                const { id, data } = update;

                // Vérifier que l'id est valide et que les données ne sont pas vides
                if (!id || !data) {
                    throw new Error("Données invalides");
                }

                return await app.prisma.article.update({
                    where: { id: Number(id) }, // Conversion correcte de l'id
                    data: {
                        ...data,
                    },
                });
            })
        );

        res.status(StatusCodes.OK)
            .send(RestResponse.response(updatedArticles, StatusCodes.OK));
    } catch (error) {
        console.error("Erreur lors de la mise à jour des articles :", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(null, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors de la mise à jour des articles"));
    }
}

// Supprimer un article
async remove(req: Request, res: Response): Promise<void> {
    try {
        const articleId = Number.parseInt(req.params.id);
        
        // Vérifiez d'abord si l'article a des détails associés
        const detailsCount = await app.prisma.detail.count({
            where: { articleId },
        });

        if (detailsCount > 0) {
            // Si des détails sont associés, renvoyez une erreur appropriée
            res.status(StatusCodes.BAD_REQUEST)
                .send(RestResponse.response(null, StatusCodes.BAD_REQUEST, "Impossible de supprimer l'article car il a des détails associés."));
            return;
        }

        // Supprimez l'article s'il n'a pas de détails
        const deletedArticle = await app.prisma.article.delete({
            where: { id: articleId },
        });

        res.status(StatusCodes.OK)
            .send(RestResponse.response(deletedArticle, StatusCodes.OK));
    } catch (error) {
        console.error("Erreur lors de la suppression de l'article :", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(null, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors de la suppression de l'article"));
    }
}
}

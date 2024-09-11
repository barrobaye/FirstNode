import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import { StatusCodes } from "http-status-codes";
import RestResponse from "../core/response";
import app from "../app";

export default class ArticleController extends Controller{
    
// Créer un nouvel article
async store(req: Request, res: Response) {
    try {
        const newData = await app.prisma.article.create({
            data: {
                libelle: req.body.libelle.toLowerCase(),  // Convertir en lowercase avant l'ajout
                prix: req.body.prix,
                quantiteStock: req.body.quantiteStock,
                categoriId: req.body.categoriId,  // Ajout de la catégorie si présente
            }
        });
        res.status(StatusCodes.OK)
            .send(RestResponse.response(newData, StatusCodes.OK));
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST)
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
    try {
        const updatedArticle = await app.prisma.article.update({
            where: { id: Number.parseInt(req.params.id) },
            data: {
               // libelle: req.body.libelle,
               // prix: req.body.prix,
                quantiteStock: req.body.quantiteStock,
              //  categoriId: req.body.categoriId,  // Mise à jour de la catégorie si présente
            }
        });
        res.status(StatusCodes.OK)
            .send(RestResponse.response(updatedArticle, StatusCodes.OK));
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(error, StatusCodes.NOT_FOUND, "Erreur lors de la mise à jour de l'article"));
    }
}

// Supprimer un article
async remove(req: Request, res: Response): Promise<void> {
    try {
        const deletedArticle = await app.prisma.article.delete({
            where: { id: Number.parseInt(req.params.id) },
        });
        res.status(StatusCodes.OK)
            .send(RestResponse.response(deletedArticle, StatusCodes.OK));
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(error, StatusCodes.NOT_FOUND, "Erreur lors de la suppression de l'article"));
    }
}
}

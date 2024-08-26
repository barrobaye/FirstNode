"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paiement_controlleur_1 = __importDefault(require("../controller/paiement.controlleur"));
const auth_middlevare_1 = require("../middleware/auth.middlevare");
const routerPaiement = (0, express_1.Router)();
const paiementController = new paiement_controlleur_1.default;
routerPaiement.get('/:id', paiementController.edit);
routerPaiement.get('/:status', paiementController.filterBy);
//routerArticle.post('/libelle', paiementController.editByLibelle);
routerPaiement.get('/', (0, auth_middlevare_1.authMiddleware)(), (0, auth_middlevare_1.authorization)(["ADMIN", "BOUTIQUIER"]), paiementController.show);
routerPaiement.post('/', paiementController.store);
exports.default = routerPaiement;
///[authMiddleware(),authorization(["ADMIN","BOUTIQUIER","CLIENT"])]

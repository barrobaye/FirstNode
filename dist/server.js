"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT ?? 3000;
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
// app.get('/clients', async (req, res) => {
//   const clients = await prisma.client.findMany({
//     include: { dettes: true },
//   });
//   res.json(clients);
// });
// app.post('/clients', async (req, res) => {
//   const { nom, prenom, telephone, photo } = req.body;
//   const client = await prisma.client.create({
//     data: {
//       nom,
//       prenom,
//       telephone,
//       photo
//     },
//   });
//   res.json(client);
// });
// app.get('/dettes', async (req, res) => {
//   const dettes = await prisma.dette.findMany({
//     include: {
//       client: true,
//       articles: {
//         include: {
//           article: true,
//         }
//       },
//       paiements: true,
//     },
//   });
//   res.json(dettes);
// });
// app.post('/dettes', async (req, res) => {
//   const { clientId, date, montantDue, montantVerser, articlesIds } = req.body;
//   const dette = await prisma.dette.create({
//     data: {
//       clientId,
//       date: new Date(date),
//       montantDue,
//       montantVerser,
//       articles: {
//         create: articlesIds.map((id: string) => ({ articleId: id })),
//       },
//     },
//   });
//   res.json(dette);
// });
// app.get('/articles', async (req, res) => {
//   const articles = await prisma.article.findMany();
//   res.json(articles);
// });
// app.post('/articles', async (req, res) => {
//   const { id, libelle, prix, quantiteStock } = req.body;
//   const article = await prisma.article.create({
//     data: {
//       id,
//       libelle,
//       prix,
//       quantiteStock
//     },
//   });
//   res.json(article);
// });
// app.get('/paiements', async (req, res) => {
//   const paiements = await prisma.paiement.findMany({
//     include: { dette: true },
//   });
//   res.json(paiements);
// });
// app.post('/paiements', async (req, res) => {
//   const { id, detteId, montant, date } = req.body;
//   const paiement = await prisma.paiement.create({
//     data: {
//       id,
//       detteId,
//       montant,
//       date: new Date(date),
//     },
//   });
//   res.json(paiement);
// });
app_1.default.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

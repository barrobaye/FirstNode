"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const clients = [
    {
        nom: "Diop",
        prenom: "Fatou",
        telephone: "77777777",
        photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    {
        nom: "Sall",
        prenom: "Samba",
        telephone: "789801232",
        photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    {
        nom: "Diouf",
        prenom: "Papa",
        telephone: "788761223",
        photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    {
        nom: "Samb",
        prenom: "Badara",
        telephone: "787871049",
        photo: "bad.jpegg"
    },
    {
        nom: "Cheikh",
        prenom: "Tiombane",
        telephone: "772142787",
        photo: "tiombane.jpg"
    },
    {
        nom: "SAPA",
        prenom: "Daguine",
        telephone: "768761642",
        photo: "sapa.png"
    }
];
const articles = [
    {
        id: "A1",
        libelle: "Article 1",
        prix: 100,
        quantiteStock: 10
    },
    {
        id: "A2",
        libelle: "Article 2",
        prix: 200,
        quantiteStock: 5
    },
    {
        id: "A3",
        libelle: "Article 3",
        prix: 150,
        quantiteStock: 20
    }
];
const dettes = [
    {
        clientId: 6,
        date: new Date("2024-07-19"),
        montantDue: 1700,
        montantVerser: 0,
    },
    {
        clientId: 1,
        date: new Date("2024-07-19"),
        montantDue: 700,
        montantVerser: 0,
    }
];
const dettesArticles = [
    {
        detteId: 1,
        articleId: "A1"
    },
    {
        detteId: 1,
        articleId: "A2"
    },
    {
        detteId: 1,
        articleId: "A3"
    },
    {
        detteId: 2,
        articleId: "A1"
    },
    {
        detteId: 2,
        articleId: "A2"
    }
];
const paiements = [
    {
        id: "03d1",
        detteId: 1,
        montant: 1000,
        date: new Date("2024-07-19T23:00:40.589Z")
    },
    {
        id: "d3ae",
        detteId: 1,
        montant: 120,
        date: new Date("2024-07-19T23:02:02.969Z")
    },
    {
        id: "cf55",
        detteId: 2,
        montant: 122,
        date: new Date("2024-07-19T23:13:04.029Z")
    }
];
async function main() {
    for (const client of clients) {
        await prisma.client.create({
            data: client,
        });
    }
    for (const article of articles) {
        await prisma.article.create({
            data: article,
        });
    }
    for (const dette of dettes) {
        await prisma.dette.create({
            data: dette,
        });
    }
    for (const detteArticle of dettesArticles) {
        await prisma.detteArticle.create({
            data: detteArticle,
        });
    }
    for (const paiement of paiements) {
        await prisma.paiement.create({
            data: paiement,
        });
    }
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

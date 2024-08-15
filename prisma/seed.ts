import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Création de clients avec des numéros de téléphone uniques
    const client1 = await prisma.client.create({
      data: {
        nom: 'Jean',
        prenom: 'Dupont',
        telephone: '123456789', // Assurez-vous que ce numéro est unique
      },
    });

    const client2 = await prisma.client.create({
      data: {
        nom: 'Marie',
        prenom: 'Curie',
        telephone: '987654321', // Assurez-vous que ce numéro est unique
      },
    });

    const client3 = await prisma.client.create({
      data: {
        nom: 'Barro',
        prenom: 'Momo',
        telephone: '007654321', // Assurez-vous que ce numéro est unique
      },
    });

    // Création d'articles
    const article1 = await prisma.article.create({
      data: {
        libelle: 'Article 1',
        prix: 10.0,
        quantiteStock: 100,
      },
    });

    const article2 = await prisma.article.create({
      data: {
        libelle: 'Article 2',
        prix: 20.0,
        quantiteStock: 50,
      },
    });

    // Création de dettes
    const dette1 = await prisma.dette.create({
      data: {
        clientId: client1.id,
        montant: 50.0,
      },
    });

    // Création de détails
    const detail1 = await prisma.detail.create({
      data: {
        articleId: article1.id,
        detteId: dette1.id, // Assurez-vous que cet ID de Dette est valide
        prixVente: 10.0,
        qteVente: 2,
      },
    });

    const detail2 = await prisma.detail.create({
      data: {
        articleId: article2.id,
        detteId: dette1.id, // Assurez-vous que cet ID de Dette est valide
        prixVente: 20.0,
        qteVente: 1,
      },
    });

    // Création de paiements
    await prisma.paiement.create({
      data: {
        montantVerser: 30.0,
        montantRest: 20.0,
        date: new Date(),
        detteId: dette1.id,
      },
    });

    // Création d'utilisateurs
    const user1 = await prisma.user.create({
      data: {
        email: 'jean.dupont@example.com',
        password: 'hashedpassword1', // Assurez-vous de hacher les mots de passe
        role: Role.CLIENT,
        clientId: client1.id,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'marie.curie@example.com',
        password: 'hashedpassword2', // Assurez-vous de hacher les mots de passe
        role: Role.ADMIN,
        clientId: client2.id,
      },
    });
    const user3 = await prisma.user.create({
      data: {
        email: 'barroe@example.com',
        password: '123passer', // Assurez-vous de hacher les mots de passe
        role: Role.BOUTIQUIER,
        clientId: client3.id,
      },
    });

    console.log('Seed data has been added successfully!');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

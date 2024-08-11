import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


async function main() {
  // Création des utilisateurs
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: await bcrypt.hash('password456', 10),
      role: 'ADMIN',
    },
  });

  // Création des clients
  const client1 = await prisma.client.create({
    data: {
      nom: 'Diop',
      prenom: 'Fatou',
      telephone: '77777777',
      userId: user1.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      nom: 'Sall',
      prenom: 'Samba',
      telephone: '789801232',
      userId: user2.id,
    },
  });

  // Création des articles
  const article1 = await prisma.article.create({
    data: {
      libelle: 'Article 1',
      prix: 100,
      quantiteStock: 10,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      libelle: 'Article 2',
      prix: 200,
      quantiteStock: 5,
    },
  });

  const article3 = await prisma.article.create({
    data: {
      libelle: 'Article 3',
      prix: 150,
      quantiteStock: 20,
    },
  });

  // Création des dettes
  const dette1 = await prisma.dette.create({
    data: {
      clientId: client1.id,
      date: new Date(),
      montantDue: 1700,
      montantVerser: 0,
      articles: {
        create: [
          { articleId: article1.id },
          { articleId: article2.id },
          { articleId: article3.id },
        ],
      },
    },
  });

  const dette2 = await prisma.dette.create({
    data: {
      clientId: client2.id,
      date: new Date(),
      montantDue: 700,
      montantVerser: 0,
      articles: {
        create: [
          { articleId: article1.id },
          { articleId: article2.id },
        ],
      },
    },
  });

  // Création des paiements
  await prisma.paiement.create({
    data: {
      detteId: dette1.id,
      montant: 1000,
      date: new Date(),
    },
  });

  await prisma.paiement.create({
    data: {
      detteId: dette2.id,
      montant: 500,
      date: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

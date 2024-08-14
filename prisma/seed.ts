import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Créer un client avec un utilisateur associé
  const client = await prisma.client.create({
    data: {
      nom: 'Doe',
      prenom: 'John',
      telephone: '1234567890',
      User: {
        create: {
          email: 'john.doe@example.com',
          password: hashedPassword,
          role: 'CLIENT',
        },
      },
    },
  });

  // Créer des articles
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

  // Créer une dette pour le client
  const dette = await prisma.dette.create({
    data: {
      clientId: client.id,
      date: new Date(),
      montant: 200.0,
      montantDue: 150.0,
      montantVerser: 50.0,
      detail: {
        create: [
          {
            articleId: article1.id,
            prixVente: 10.0,
            qteVente: 5.0,
          },
          {
            articleId: article2.id,
            prixVente: 20.0,
            qteVente: 2.5,
          },
        ],
      },
    },
  });

  // Créer un paiement pour cette dette
  await prisma.paiement.create({
    data: {
      detteId: dette.id,
      montant: 50.0,
      date: new Date(),
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

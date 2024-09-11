const { PrismaClient } = require('@prisma/client');


const prismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Ajoutez cette ligne pour activer le logging
  });
  
export default prismaClient;
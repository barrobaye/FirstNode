import app from './app';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT ?? 3000;

// Configurer CORS avant de définir les routes
// app.server.use(cors({
//   origin: 'http://localhost:5174', // Autoriser uniquement votre frontend
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Autoriser les méthodes HTTP nécessaires
//   optionsSuccessStatus: 200, // Some legacy browsers choke on 204

//   //credentials: true // Si vous avez besoin d'envoyer des cookies ou des informations d'authentification
// }));

app.server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

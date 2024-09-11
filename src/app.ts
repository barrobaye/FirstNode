import express from 'express';
import cors from 'cors'; 
import routerCategorie from './route/categorie.route'
import routerArticle from './route/article.route'
import routerClient from './route/client.route';
import prismaClient from './config/prisma.config';
import routerAuth from './route/auth.route';
import routerDette from './route/dette.route';
import routerPaiement from './route/paiement.route';
import routerUser from './route/user.route';
// Import the CORS middleware



class App{
   public server;
   public prisma;
      constructor(){  
        this.server = express(); 
        this.middleware();
        this.routes();  
        this.prisma = prismaClient;
       
    }
    middleware(){

      const corsOptions = {
      origin: 'http://localhost:5173', 
      credentials: true,// Replace with your frontend URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    };

    this.server.use(express.json());
    this.server.use(cors(corsOptions)); // Use CORS middleware with options

  }
    routes(){
      
     this.server.use("/api/v1/article",routerArticle),
     this.server.use("/api/v1/categorie",routerCategorie),
     this.server.use("/api/v1/clients",routerClient),
     this.server.use("/api/v1/dette",routerDette),
     this.server.use("/api/v1",routerAuth),
     this.server.use("/api/v1/paiement",routerPaiement),
     this.server.use("/api/v1/users",routerUser)
    }
}
//const server = express();
//app.get("/api/v1/article", new ArticleController().edit)

const app = new App();
export default app;

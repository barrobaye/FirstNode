import express from 'express';
import routerArticle from './route/article.route'
import routerClient from './route/client.route';
import prismaClient from './config/prisma.config';
import routerAuth from './route/auth.route';
import routerDette from './route/dette.route';
import routerPaiement from './route/paiement.route';
import routerUser from './route/user.route';
   


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
        this.server.use(express.json());
    }
    routes(){
     this.server.use("/api/v1/article",routerArticle),
     this.server.use("/api/v1/clients",routerClient),
     this.server.use("/api/v1/dette",routerDette),
     this.server.use("/api/v1/auth",routerAuth),
     this.server.use("/api/v1/paiement",routerPaiement),
     this.server.use("/api/v1/users",routerUser)
    }
}
const server = express();
//app.get("/api/v1/article", new ArticleController().edit)

const app = new App();
export default app;

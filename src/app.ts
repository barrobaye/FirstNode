import express from 'express';
import routerArticle from './route/article.route'
import routerClient from './route/client.route';
import prismaClient from './config/prisma.config';
   


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
     this.server.use("/api/v1/article",routerArticle);
     this.server.use("/api/v1/clients",routerClient);
    }
}
const server = express();


//app.get("/api/v1/article", new ArticleController().edit)


const app = new App();
export default app;

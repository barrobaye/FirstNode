import { RequestHandler } from "express";
import { ResponseValidator, supportedMethods } from "./response.validator";
import { articlePostShema } from "./validator/article.shema";
import { clientPostShema } from "./validator/client.shema";
import { StatusCodes } from "http-status-codes";
import RestResponse from "../core/response";
import { z, ZodError } from "zod";

const shema = {
    "post/api/v1/clients":clientPostShema,
    "post/api/v1/article":articlePostShema
    } as { [key:string]:z.ZodObject<any,any> };

    const ValidatorShema = ():RequestHandler => {
        
        return  async (req, res, next) => {

            //Methode de la requête 
            const method = req.method.toLowerCase();
            if (!supportedMethods.includes(method)) {
                 return next ();
            }
            try {
                //Validation
                const schemaKey =`${method}${req.originalUrl}`
                const shemas = shema[schemaKey];
             await shemas.parseAsync(req.body);
               return next();
                  
            } catch (error) {
                if (error instanceof ZodError) {
                    const reponseValidator: ResponseValidator = {
                        errors: error.errors.map((issue: any)=>({
                            message:`${issue.path.join('.')} is ${issue.message}`,
    
                        })),
                        status: false
                    }
                    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(RestResponse.response(reponseValidator, StatusCodes.UNPROCESSABLE_ENTITY.valueOf()));
                    
                }
                
            }
        }
        
    }
    export default ValidatorShema
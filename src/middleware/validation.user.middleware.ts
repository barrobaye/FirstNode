import { RequestHandler } from "express";
import { ResponseValidator, supportedMethods } from "./response.validator";
import { articlePostShema } from "./validator/article.shema";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import RestResponse from "../core/response";
import { userPostShema } from "./validator/user.shema";

const ValidatorArticle = ():RequestHandler => {
    return  async (req, res, next) => {
        //Methode de la requête 
        const method = req.method.toLowerCase();
        if (!supportedMethods.includes(method)) {
             return next ();
        }
        try {
         await   userPostShema.parseAsync(req.body);
            next();
              
        } catch (error) {
            if (error instanceof ZodError) {
                const reponseValidator: ResponseValidator = {
                    errors: error.errors.map((issue: any)=>({
                        message:`${issue.path.join('.')} is ${issue.message}`

                    })),
                    status: false
                }
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(RestResponse.response(reponseValidator, StatusCodes.CONFLICT));
                
            }
            
        }
    }
}
export default ValidatorArticle
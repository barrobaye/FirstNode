import { RequestHandler } from "express";
import { ResponseValidator, supportedMethods } from "./response.validator";
import { clientPostShema } from "./validator/client.shema";
import { ZodError } from "zod";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";

const ValidatorClient = ():RequestHandler => {
    return (req, res, next) => {
        //Methode de la requête 
        const method = req.method.toLowerCase();
        if (!supportedMethods.includes(method)) {
             return next ();
        }
        try {
            clientPostShema.parse(req.body);
            next();
              
        } catch (error) {
            if (error instanceof ZodError) {
                const reponseValidator: ResponseValidator = {
                    errors: error.errors.map((issue: any)=>({
                        message:"${issue.path.join('.')} is ${issue.message}"

                    })),
                    status: false
                }
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(RestResponse.response(reponseValidator, StatusCodes.UNPROCESSABLE_ENTITY));
                
            }
            
        }
    }
}
export default ValidatorClient
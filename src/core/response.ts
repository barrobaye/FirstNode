import {StatusCodes} from "http-status-codes"

interface RestResponseInterface <T>{
    status: StatusCodes,
    data: T,
    message:string
    }
    export  default class RestResponse{
     static response<T>(data:T, httpCode: StatusCodes, message:string = "Traitement réussit")
       {
        return{
            status:httpCode,
            data: data,
            message ,
     
         }as RestResponseInterface <T>
       }
    }
    //const response = new RestResponse
//export default response

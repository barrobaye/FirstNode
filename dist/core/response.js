"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RestResponse {
    static response(data, httpCode, message = "Traitement réussit") {
        return {
            status: httpCode,
            data: data,
            message,
        };
    }
}
exports.default = RestResponse;
//const response = new RestResponse
//export default response

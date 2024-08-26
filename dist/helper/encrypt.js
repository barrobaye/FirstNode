"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
class encrypt {
    static async encryptepass(password) {
        return bcryptjs_1.default.hashSync(password, 12);
    }
    static comparepassword(hashPassword, password) {
        return bcryptjs_1.default.compare(password, hashPassword);
    }
}
exports.encrypt = encrypt;
//ça passe pas
//     static async generateToken(playload:playload,sercret:string=JWT_SECRET!,expiresIn:string=JWT_EXPIRES_IN!){
//         return jwt.sign(playload, sercret,{expiresIn: expiresIn})
// }

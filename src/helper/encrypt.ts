import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface playload{
    id:number, email:string;
}
const {JWT_SECRET, JWT_EXPIRES_IN} = process.env;
export class encrypt{
    static async encryptepass(password:string){
        return bcrypt.hashSync(password, 12)

    }
    static comparepassword(hashPassword:string,password:string){
        return bcrypt.compare(password, hashPassword)
        
    }

}
//ça passe pas
//     static async generateToken(playload:playload,sercret:string=JWT_SECRET!,expiresIn:string=JWT_EXPIRES_IN!){
//         return jwt.sign(playload, sercret,{expiresIn: expiresIn})
// }
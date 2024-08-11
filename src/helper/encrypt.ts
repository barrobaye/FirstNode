import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface playload{
    id:number, email:string,role:string;
}
const {JWT_SECRET, JWT_EXPIRES_IN} = process.env;
export class encrypt{
    static async encryptepass(password:string){
        return bcrypt.hashSync(password, 12)

    }
    static comparepassword(hashPassword:string,password:string){
        return bcrypt.compare(password, hashPassword)
        
    }
    static async generateToken(playload:playload,expiresIn:string=JWT_EXPIRES_IN!){
        return jwt.sign(playload, `${JWT_SECRET}`,{expiresIn: expiresIn})
}
}
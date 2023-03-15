import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';
import * as jwt from 'jsonwebtoken';
import * as express from 'express';
export const authValidator = async (req: express.Request) => {
    const { headers } = req;
    
    if(Object.keys(headers).includes('x-express-auth')) {
        const v = headers['x-express-auth'];
        if(v === '123') {
            return;
        } else {
            return false;
        }
    } else {
        throw {
            statusCode: 401,
            message: "Unauthorized"
        }
    }
}

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}
type DecodedT = {
    email: string,
    expiresIn: number,
    access_token: string
}
interface IAuth {
    email: string,
}
export const auth = async (req: express.Request): Promise<IAuth> => {
    try {
        const { headers } = req;
        if(Object.keys(headers).includes('authorization')) {
            const token = headers['authorization'].toString().replace('Bearer ', '');
            if(token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedT;
                return decoded;
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    } catch (error) {
        throw {
            statusCode: 404,
            message: "Unauthorized"
        };
    }
}
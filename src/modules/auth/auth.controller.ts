import { auth, authValidator } from './../../utils/auth-validator/index';
import { expressValidator } from './../../utils/class-validation/index';
import * as express from "express";
import { defaultURL } from "../../routes";
import { register, login } from './auth.service';

const tag = "auth"
export const authController = (app: express.Application) => {

    app.post(`${defaultURL}/${tag}/register`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            console.log(req.body)
            await register(req.body)
            res.send()
        } catch (error) {
            res.json(error)
        }
    })

    app.post(`${defaultURL}/${tag}/login`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            const result = await login(req.body)
            res.json({
                statusCode: 200,
                message: "Logged in",
                data: result
            })
        } catch (error) {
            res.status(400).json(error)
        }
    })

    app.get(`${defaultURL}/${tag}/verify-jwt`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            const authenticated = await auth(req);
            
            res.json({
                statusCode: 200,
                message: "Verified"
            })
        } catch (error) {
            res.status(400).json(error)
        }
    })
}
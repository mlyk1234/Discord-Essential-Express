import { addBot, getBots, botJoin, verifyBot, getBotByAccId, botListenChannel, botJoinVoice, sendText, sendReact } from './bot.service';
import { auth, authValidator } from '../../../utils/auth-validator/index';
import { expressValidator } from '../../../utils/class-validation/index';
import * as express from "express";
import { defaultURL } from "../../../routes";
import { IsString, validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { classValidatorParser } from "../../../utils/helpers/class-validator-helper";
import initLogUser from "../../../database/models/logger";

const tag = "discord"
export const discordBotController = (app: express.Application) => {

    app.post(`${defaultURL}/${tag}/verify-token`,
    async (req, res, next) => {
        try {
        const result = await verifyBot(req.body.loginToken);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: error
            });
        }
    })

    app.get(`${defaultURL}/${tag}/bot/:acc_id?`,
    async (req, res, next) => {
        try {
            let result;
            if(req.params.acc_id) {
                result = await getBotByAccId(Number(req.params.acc_id))
            } else {
                result = await getBots();
            }
            
            res.json(result);
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: "Unable to fetch data.",
                reason: error
            });
        }
    })

    app.get(`${defaultURL}/${tag}/messages/`,
    async (req, res, next) => {
        try {
            let result;
            
            res.json(result);
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: "Unable to fetch data.",
                reason: error
            });
        }
    })

    app.post(`${defaultURL}/${tag}/bot`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            await addBot(req.body)
            res.json({
                statusCode: 200,
                message: "Success."
            })
        } catch (error) {
            res.status(400).json({
                ...error
            })
        }
    })

    app.post(`${defaultURL}/${tag}/botjoin`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            console.log(req.body)
            await botJoin(req.body)
            res.status(200).json({
                statusCode: 200,
                message: "Success."
            })
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: error
            })
        }
    })

    app.post(`${defaultURL}/${tag}/botListen`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            console.log(req.body)
            await botListenChannel("1080470098231431258", "1080735957529149400", 1080440174040858600)
            res.status(200).json({
                statusCode: 200,
                message: "Success."
            })
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: error
            })
        }
    })

    app.post(`${defaultURL}/${tag}/join-voice`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            console.log(req.body)
            await botJoinVoice("1080470098231431258", "1080735957529149400", 1080440174040858600)
            res.status(200).json({
                statusCode: 200,
                message: "Success."
            })
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: error
            })
        }
    })

    app.post(`${defaultURL}/${tag}/send-text`,
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            await sendText(req.body, true);
            res.status(200).json({
                statusCode: 200,
                message: "Sent."
            })
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: "Failed.",
                reason: error
            })
        }
    })

    app.post(`${defaultURL}/${tag}/send-react`,
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            await sendReact(req.body);
            res.status(200).json({
                statusCode: 200,
                message: "Reacted."
            })
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: "Failed.",
                reason: error
            })
        }
    })


}
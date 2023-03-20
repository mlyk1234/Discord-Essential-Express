import { insertGuild, getGuilds, updateQA, getQA, getLogs } from './manager.service';
import { auth } from '../../../utils/auth-validator/index';
import { expressValidator } from '../../../utils/class-validation/index';
import * as express from "express";
import { defaultURL } from "../../../routes";
import { guildManagerDto } from './dto/manager.dto';

const tag = "discord"
export const discordManagerController = (app: express.Application) => {

    app.post(`${defaultURL}/${tag}/guild`,
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            await auth(req);
            await expressValidator(req.body, guildManagerDto);
            await insertGuild(req.body);
            res.status(200).json({
                statusCode: 200,
                message: "Inserted new guild."
            });
        } catch (error) {
            res.status(400).json(error)
        }
    });

    app.get(`${defaultURL}/${tag}/guild`,
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            await auth(req);
            const result = await getGuilds();
            res.status(200).json({
                statusCode: 200,
                message: "Getting all guilds done.",
                data: result
            });
        } catch (error) {
            res.status(400).json(error)
        }
    });

    app.post(`${defaultURL}/${tag}/guild-settings`,
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            // const authentication = await auth(req);
            await insertGuild(req.body);
            res.status(200).json({
                statusCode: 200,
                message: "Inserted new guild."
            });
        } catch (error) {
            res.status(400).json(error)
        }
    });

    app.get(`${defaultURL}/${tag}/questions/:type?`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            const result = await getQA(req.body, req.params.type);
            res.status(200).json({
                statusCode: 200,
                message: "Success.",
                data: result
            })
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: error
            })
        }
    })

    app.post(`${defaultURL}/${tag}/update-questions`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            await updateQA(req.body);
            res.json({
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

    app.get(`${defaultURL}/${tag}/logs/:acc_id?`, 
    async (req: express.Request, res: express.Response<any>, next: express.NextFunction) => {
        try {
            const result = await getLogs(req.params.acc_id);
            res.status(200).json({
                statusCode: 200,
                message: "Success.",
                data: result
            })
        } catch (error) {
            res.status(400).json({
                statusCode: 400,
                message: error
            })
        }
    })
}
import { discordBotController } from './discord/bot/bot.controller';
import { authController } from './auth/auth.controller';
import { discordManagerController } from './discord/manager/manager.controller';
import * as express from "express";
export const resolveModules = (app: express.Application) => {

    const module = [
        {
            tag: 'DiscordManager',
            resolve: discordManagerController(app)
        },
        {
            tag: 'DiscordBot',
            resolve: discordBotController(app)
        },
        {
            tag: 'Auth',
            resolve: authController(app)
        }
    ]
    module.map(m => console.log('Resolved', m.tag))
}
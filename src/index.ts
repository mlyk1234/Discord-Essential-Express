import { discordCron } from './modules/discord/cron/index';
import { resolveModules } from './modules/index';
import { Message, captchaServices } from './../node_modules/discord.js-selfbot-v13/typings/index.d';
import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";

import * as routes from "./routes";
import * as database from "./database";

import * as registerEndpoints from "./modules";
import * as userController from "./modules/user/user.controller";
import * as discordBotController from "./modules/discord/manager/manager.controller";

import { Client } from "discord.js-selfbot-v13";
import { Events } from "discord.js";
import 'reflect-metadata';
import 'es6-shim';

import { errorHandler } from "./utils/error-handler/error-handler";

import * as _ from "lodash";

dotenv.config();

// const client = new Client({
//     captchaService: '2captcha',
//     captchaKey: 'e46f260e341d9407a4abf7c8a7f12beb'
// });
const mockData = {
    id: 1,
    guildId: 1080470098231431258,
}

const mockDataBot: any[] = [
    {
        id: 1,
        loginToken: 'MTA4MTkyMzk5ODkzMTIzODk2Mg.Gy3sD8.r7L2fsfVlVTJIVxdf34LFuv3lcOjrMXup-6lBU',
        status: "Enabled",
        joinedGuild: ['761326284990316574', '1080470098231431258'],
        listenChannel: ['anything'],
        presence: 'invisible'
    },
    // {
    //     id: 2,
    //     loginToken: 'MTA4MDczNTk1NzUyOTE0OTQ2MA.GSFTk9.sEiYlMOkYRPFEMxZ6ZayuXz138Wt7ZvMhUTLvg',
    //     status: "Enabled",
    //     joinedGuild: ['761326284990316574', '1080470098231431258'],
    //     listenChannel: [],
    //     presence: 'idle'
    // }
    // {
    //     id: 1,
    //     loginToken: 'NTU5MDI5NTgxNDQ5Nzg5NDYx.GSG6B0.d4mcSH-1_JdQDxchJCKL3WHNjeKpnHH-0fEpDE',
    //     status: "Enabled",
    //     joinedGuild: [],
    //     listenChannel: ['anything'],
    //     presence: 'invisible'
    // },
]

async function dispatchBot(botData: typeof mockDataBot) {
    botData.map(b => {
const client = new Client({
    captchaService: '2captcha',
    captchaKey: 'e46f260e341d9407a4abf7c8a7f12beb'
});

        client.on('ready', async (c) => {
            console.log(`Logged in as ${client.user.tag}`);
            // c.user.setStatus('idle');
            await updatePresence(c, 'idle')
            try {
                const getChannel = c;
                // await updatePresence(c, b.presence);
                // console.log('gg', client.guilds.cache)
                // const guildId = c.guilds.cache.map(guild => guild.id);
                // console.log(c.guilds.cache)
                // const res = await c.fetchInvite('Th7ZTJag')
                // if(res) {
                //     const { id } = res.guild;

                //     // console.log(res.guild);

                //     if(b.joinedGuild.includes(id)) {
                //         console.log('already joined .')
                //     } else {
                //         console.log('havent join')
                //         const res2 = await c.acceptInvite('Th7ZTJag')
                //         console.log('joined', res2)
                //     }
                // }
                // console.log('?????', res)
                // if(res) {
                //     const res2 = await c.acceptInvite('Th7ZTJag')
                //     console.log('keks', res2)
                // }
                
            } catch (error) {
                console.log('[Errorer]:', error)
            }
        })
        
        const updatePresence = async (client: any, state: any) => {
            await client.user.setStatus(state);
        }
        client.on('messageCreate', async message => {
            console.log(message)
            if (message.components.length) {
              console.log('hello')
            }
        });
        // client.on(Events.Raw, async (interact) => {
        //     console.log('test', interact)
        // })
        client.on('message', async (msg) => {
            if(b.id === 2){
                console.log(msg)
            }
            
            const msgChannel = msg.channel as typeof msg.channel & {name: string};
            if(b.listenChannel.includes(msgChannel.name))
            {
                if(msg.content === 'excuse me') {
                    await msg.channel.send('whats')
                }
                if(msg.content === 'react') {
                    const shuffledReact = _.shuffle(randReact);
                    for await (const r of shuffledReact) {
                        await msg.react(r);
                    }
                }
            }
        })

        client.on("interactionCreate", function(interaction){
            console.log(`an interaction has been created`);
            console.log({interaction});
        });
        
        client.login(b.loginToken);
    })
}

const randReact = ['😄', '🤔', '🤣', '🚀']

// dispatchBot(mockDataBot);
const app = express();

app.use(express.json());

app.use(cors());
app.use(errorHandler);

const port = process.env.SERVER_PORT || 3001;

app.set("views", path.join( __dirname, "views"));
app.set("view engine", "ejs");

const task = new discordCron();
task.runInterval();
task.awakeBot();

database.databaseConfig(app);
routes.register(app);
resolveModules(app);
// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server running at port: ${ port }` );
});
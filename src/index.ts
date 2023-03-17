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

// dispatchBot(mockDataBot);
const app = express();

app.use((req, res, next) => {
    const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
})
app.use(express.json());
app.use(cors({
    origin: '*'
}));
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
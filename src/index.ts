import { discordCron } from './modules/discord/cron/index';
import { resolveModules } from './modules/index';
import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";

import * as routes from "./routes";
import * as database from "./database";
import 'reflect-metadata';
import 'es6-shim';

import { errorHandler } from "./utils/error-handler/error-handler";

import * as _ from "lodash";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

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
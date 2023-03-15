import * as express from "express";
import mongoose from "mongoose";

export const databaseConfig = async (app: express.Application) => {

    const dbUrl = process.env.DB_URL;
    const dbName = process.env.DB_NAME;
    if(dbUrl && dbName) {
        const mongoString = `${process.env.DB_URL}/${process.env.DB_NAME}`;

        mongoose.connect(mongoString, {
            retryWrites: true,
            w: "majority"
        });
    
        const database = mongoose.connection
    
        database.on('error', (error) => {
            // tslint:disable-next-line:no-console
            console.log(error)
        })
    
        database.once('connected', (ans) => {
            // tslint:disable-next-line:no-console
            console.log('Database Connected', ans);
        })

    } else {
        console.log('Database not configured')
    }

}
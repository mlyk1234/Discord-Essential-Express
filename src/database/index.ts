import * as express from "express";
import mongoose from "mongoose";

export const databaseConfig = async (app: express.Application) => {

    const dbUrl = process.env.DB_URL;
    const dbName = process.env.DB_NAME;
    if(dbUrl && dbName) {
        let mongoString = `${process.env.DB_URL}/${process.env.DB_NAME}?authSource=admin`;
        if(process.env.NODE_ENV !== 'dev') {
            mongoString = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.DB_HOST}:${process.env.MONGODB_PORT}/${process.env.DB_NAME}?authSource=admin`;
        }

        mongoose.connect(mongoString, {
            retryWrites: true,
            w: "majority"
        });
    
        const database = mongoose.connection
    
        database.on('error', (error) => {
            // tslint:disable-next-line:no-console
            console.log('[DB Error]', error)
        })
    
        database.once('connected', (ans) => {
            // tslint:disable-next-line:no-console
            console.log('Database Connected', ans);
        })

    } else {
        console.log('Database not configured')
    }

}
import * as express from "express";
// import { registerEndpoints } from "../modules/index";
export const defaultURL = "/api/v1";

export const register = (app: express.Application) => {

    app.get(defaultURL, (req,res) => {
        res.json({message: "Nothing to show"})
    })
}
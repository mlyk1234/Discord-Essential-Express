import * as express from "express";
import { defaultURL } from "../../routes";
import { getUsers } from "./user.service";
import { IsString, validate } from "class-validator";
import { ErrorException } from "../../utils/error-handler/error-exception";
import { ErrorCode } from "../../utils/error-handler/error-code";

class ClaimDTO {
    @IsString()
    email: string;
}

export const userController = (app: express.Application) => {

    app.get(`${defaultURL}/users`, async (req,res) => {
        res.send("hi")
    })
}
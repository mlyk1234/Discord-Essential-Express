import initQuestionnaire, { IQuestionnaire } from "../../../database/models/questionnaire";
import initGuild from "../../../database/models/guild";
import initGuildSetting from "../../../database/models/guild-settings";

export const insertGuild = async (payload: any) => {
    try {
        await initGuildSetting.create({
            ...payload
        })
    } catch (error) {
        throw {
            statusCode: 400,
            message: "[Error]",
            reason: error
        }
    }
}

export const getGuilds = async () => {
    try {
        return await initGuild.find({
            status: "A"
        }).select(["guild_name", "guild_id"]);
    } catch (error) {
        throw "Something went wrong in getting guilds"
    }
}

export const getQA = async (payload: IQuestionnaire & IQuestionnaire[], type?: string) => {
    try {
        const qb = initQuestionnaire;
        if(type) {
            return await qb.find({
                type: type
            }).select(["type", "text"]);
        } else {
            return await qb.find().select(["type", "text"]);
        }
    } catch (error) {
        throw error;
    }
}

export const updateQA = async (payload: IQuestionnaire & IQuestionnaire[]) => {
    try {
        if(payload.length > 0) {
            for await (const item of payload) {
                await initQuestionnaire.create(item).catch((err) => {
                    throw `[Duplicated]: ${item.text}`
                });
            }
        } else {
            await initQuestionnaire.create(payload).catch((err) => {
                throw `[Duplicated]: ${payload.text}`
            });
        }
    } catch (error) {
        throw error;
    }
}
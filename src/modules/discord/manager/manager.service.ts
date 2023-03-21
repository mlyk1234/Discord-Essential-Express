import initQuestionnaire, { IQuestionnaire } from "../../../database/models/questionnaire";
import initGuild from "../../../database/models/guild";
import initGuildSetting from "../../../database/models/guild-settings";
import initDiscordBotEvent from "../../../database/models/bot-event";
import initDiscordBot from "../../../database/models/discord-bot";

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
        const guilds = await initGuild.find({
            status: "A"
        }).select(["guild_name", "guild_id", "guild_link"]);
        return guilds;
    } catch (error) {
        throw "Something went wrong in getting guilds"
    }
}

export const removeGuild = async (guild_id: string) => {
    try {
        const guilds = await initGuild.deleteOne({
            guild_id: guild_id
        })

        return guilds;
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

export const getLogs = async (acc_id?: string | null | undefined) => {
    try {
        if(acc_id) return await initDiscordBotEvent.find({
            "acc_data.acc_id": acc_id
        });
        return await initDiscordBotEvent.find();
    } catch (error) {
        throw error;
    }
}
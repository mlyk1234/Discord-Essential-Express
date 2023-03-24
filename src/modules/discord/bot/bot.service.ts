import { IDiscordBot } from './../../../database/models/discord-bot';
import * as axios from "axios";
import * as utf8 from "utf8";
import initGuild from "../../../database/models/guild";
import initDiscordBot from "../../../database/models/discord-bot";
import { Client } from "discord.js-selfbot-v13";
import { VoiceChannel } from "discord.js";
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from '@discordjs/voice';
import { createDiscordJSAdapter } from "./adapter";
import initDiscordBotEvent from "../../../database/models/bot-event";
import initGuildSetting from "../../../database/models/guild-settings";
export const getBots = async () => {
    try {
        const result = await initDiscordBot.find({
            status: 'A'
        });
        return result
    } catch (error) {
        throw "Something went wrong [getBots]."
    }
}

export const getBotByAccId = async (acc_id: number) => {
    try {
        const result = await initDiscordBot.findOne({
            acc_id: acc_id
        });

        return result
    } catch (error) {
        console.log(error)
        throw "Not found."
    }
}

export const addBot = async (payload: any) => {
    try {
        const findOne = await initDiscordBot.findOne({
            emailAddress: payload.emailAddress
        });
        if(!findOne) {
            const { id, username, phoneNumber, emailAddress } = await verifyBot(payload.loginToken);
            await initDiscordBot.create({
                acc_id: id,
                loginToken: payload.loginToken,
                username: username,
                phoneNumber: phoneNumber,
                emailAddress: emailAddress,
                role: payload.role,
                status: 'A'
            })
        } else {
            throw "Already exist."
        }
    } catch (error) {
        throw {
            statusCode: 400,
            message: "Something went wrong.",
            reason: error
        };
    }
}

export const editBot = async (payload: any) => {
    try {
        const findOne = await initDiscordBot.findOne({
            loginToken: payload.loginToken
        });
        if(!findOne) {
            throw "Not found."
        } else {
            console.log(payload)
            await verifyBot(payload.newLoginToken);
            await initDiscordBot.updateOne({
                loginToken: payload.loginToken
            }, {
                $set: {
                    loginToken: payload.newLoginToken
                }
            })
        }
    } catch (error) {
        throw {
            statusCode: 400,
            message: "Something went wrong.",
            reason: error
        };
    }
}

const verifyInvite = async (guild_id: string) => {
    try {
        const result = await initGuild.findOne({
            guild_id: guild_id
        });
        if(!result) throw "Invalid Guild ID.";
        return result;
    } catch (error) {
        throw error;
    }
}

export const botJoin = async (payload: any) => {
    try {
        const bot = await initDiscordBot.findOne({
            acc_id: payload.acc_id
        });
        if(!bot) throw "Bot Not Found.";

        const guild_data = await verifyInvite(payload.guild_id);
        const { settings } = bot;
        settings.forEach((v) => {
            if(v.joinedGuild === guild_data.guild_id) {
                throw "Already Joined.";
            }
        })

        if(bot) {
            await initDiscordBot.findOneAndUpdate({
                acc_id: payload.acc_id
            }, {
                $push: {
                    settings: {
                        joinedGuild: guild_data.guild_id,
                        guildName: guild_data.guild_name
                    }
                }
            }, {
                upsert: true
            })

        } else {
            throw "Bot Not Found.";
        }

    } catch (error) {
        console.log(error)
        throw error
    }
}
// Automation Mode
export const botJoinV2 = async (payload: any) => {
    const client = new Client({
        captchaService: '2captcha',
        captchaKey: 'e46f260e341d9407a4abf7c8a7f12beb'
    });
    try {
        const bot = await initDiscordBot.findOne({
            acc_id: payload.acc_id
        });
        if(!bot) throw "Bot Not Found.";

        const guild_data = await verifyInvite(payload.guild_id);
        const { settings } = bot;
        settings.forEach((v) => {
            if(v.joinedGuild === guild_data.guild_id) {
                throw "Already Joined.";
            }
        })

        if(bot) {
            await client.login(bot.loginToken);
            const invite = await client.fetchInvite(guild_data.guild_link);
            if(invite) {
                const { id } = invite.guild;
                // Second Layer Check
                const { settings } = bot;
                settings.forEach((v) => {
                    if(v.joinedGuild === id) {
                        throw "Already Joined.";
                    }
                })
                // SKIPPED IF THROWN
                await client.acceptInvite(guild_data.guild_link);
                await initDiscordBot.findOneAndUpdate({
                    acc_id: payload.acc_id
                }, {
                    $push: {
                        settings: {
                            joinedGuild: guild_data.guild_id,
                            guildName: guild_data.guild_name
                        }
                    }
                }, {
                    upsert: true
                })
                // 
                await botJoinAcceptance(guild_data.guild_id, bot);
            }
        } else {
            client.destroy();
            throw "Bot Not Found.";
        }

    } catch (error) {
        client.destroy();
        throw error
    }
}
// Automation Mode

export const botJoinAcceptance = async (guild_id: string, bot: IDiscordBot) => {
    try {
        const result = await initGuildSetting.findOne({
            guild_id: guild_id
        });
    
        if(result) {
            await axios.default.put(`https://discord.com/api/v9/guilds/${guild_id}/requests/@me`, {
                form_fields: result.form_fields
            }, {
                headers: {
                    authorization: bot.loginToken
                }
            })
            await createInteraction(bot);
        } else {
            // then skip if not needed
        }
    } catch (error) {
        throw "Something went wrong [botJoinAcceptance]";
    }
}

export const createInteraction = async (bot: IDiscordBot) => {
    try {
        // Step 1: Accept Rules
        await axios.default.post(`https://discord.com/api/v9/interactions`,
        {
            "type": 3,
            "guild_id": "1013725662760153138",
            "channel_id": "1043125104466464828",
            "message_id": "1077186290136645662",
            "application_id": "155149108183695360",
            "session_id": "601a6d96a0252d9f5683a6cb8a10a70c",
            "data": {
              "component_type": 2,
              "custom_id": "rr:btn:0"
            }
        }, {
            headers: {
                authorization: bot.loginToken
            }
        })
        const toUTF8 = encodeURIComponent(bot.role);
        // Step 2: Claim Role
        await axios.default.put(`
        https://discord.com/api/v9/channels/1055408941380665374/messages/1077192393272590396/reactions/${toUTF8}/%40me?location=Message&type=0`,
        null,
        {
            headers: {
                authorization: bot.loginToken
            }
        })
    } catch (error) {
        console.log('Something went wrong [createInteraction]')
    }
}

export const botListenChannel = async (guild_id: string, channel_id: string, acc_id: number) => {
    const client = new Client();
    try {
        const bot = await initDiscordBot.findOne({
            acc_id: acc_id
        });
        if(!bot) throw "Bot Not Found.";
        await client.login(bot.loginToken);

        const guilds = client.guilds.cache;

        guilds.forEach((k) => {
            console.log(k)
        })
    } catch (error) {
        throw error;
    }
}

export const botJoinVoice = async (guild_id: string, channel_id: string, acc_id: number) => {
    const client = new Client({
        patchVoice: true
    });
    try {
        const bot = await initDiscordBot.findOne({
            acc_id: acc_id
        });
        if(!bot) throw "Bot Not Found.";
        await client.login(bot.loginToken);
        const dmChannel = client.channels.cache.get("1083496797676249201");
        
    } catch (error) {
        console.log(error)
        client.destroy();
        throw error;
    }
}

async function connectToChannel(channel: VoiceChannel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: createDiscordJSAdapter(channel),
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

export const verifyBot = async (loginToken: string) => {
    const client = new Client();
    try {
        await client.login(loginToken);
        
        const { id, username, phoneNumber, emailAddress } = client.user
        client.destroy()
        //! await client.logout(); avoid using logout otherwise token changed!
        return {
            id,
            username,
            phoneNumber,
            emailAddress
        }
    } catch (error) {
        throw 'Invalid Token'
    }
}
interface IBaseInterface {
    loginToken: string,
    reply_to?: string
}
export interface ISendText extends IBaseInterface {
    channel_id: string,
    channel_name: string,
    guild_id: string,
    guild_name: string,
    text: string,
    is_reply?: boolean,
    message_id?: string,
    scheduledAt?: number
    config?: any;
}

export const sendText = async (payload: ISendText, controller?: boolean) => {
    try {
        if(!payload.scheduledAt) {
            await axios.default.post(
                `https://discord.com/api/v9/channels/
                ${payload.channel_id}/messages`,
                {
                    content: payload.text,
                    message_reference: payload.is_reply ? replyContruct(payload): null
                },
                {
                    headers: {
                        authorization: payload.loginToken
                    }
                }
            )
        }
        if(controller) {
            const findBot = await initDiscordBot.findOne({
                loginToken: payload.loginToken
            })
            const acc_data = {
                acc_id: findBot.acc_id,
                username: findBot.username,
                loginToken: findBot.loginToken
            }
            const logData = {
                guild_id: payload.guild_id,
                guild_name: payload.guild_name,
                channel_id: payload.channel_id,
                channel_name: payload.channel_name,
                text: payload.text,
                is_reply: payload.is_reply,
                reply_to: payload.reply_to,
                message_id: payload.message_id,
                scheduledAt: payload.scheduledAt,
                sent: payload.scheduledAt ? false : true
            }
            await initDiscordBotEvent.create({
                acc_data: acc_data,
                ...logData
            })
        }
    } catch (error) {
        throw "Message cannot be sent. Check logs for issues.";
    }
}

const replyContruct = (payload: ISendText) => {
    return {
        "guild_id": payload.guild_id,
        "channel_id": payload.channel_id,
        "message_id": payload.message_id
    }
}

interface ISendReact extends IBaseInterface {
    channel_id: string,
    guild_id: string,
    message_id: string,
    scheduledAt?: number
    react: string[],
    config?: any;
}

export const sendReact = async (payload: ISendReact) => {
    const client = new Client();
    try {
        for await(const r of payload.react) {
            const toUTF8 = encodeURIComponent(r);
            await axios.default.put(
                `https://discord.com/api/v9/channels/
                ${payload.channel_id}/messages/
                ${payload.message_id}/reactions/${toUTF8}/%40me?location=Message&type=0`,
                null,
                {
                    headers: {
                        authorization: payload.loginToken
                    }
                }
            )
        }

        const findBot = await initDiscordBot.findOne({
            loginToken: payload.loginToken
        })
        const acc_data = {
            acc_id: findBot.acc_id,
            username: findBot.username,
            loginToken: findBot.loginToken
        }
        const logData = {
            guild_id: payload.guild_id,
            channel_id: payload.channel_id,
            react: payload.react,
            is_reply: false,
            reply_to: payload.reply_to,
            message_id: payload.message_id,
            scheduledAt: payload.scheduledAt,
            sent: payload.scheduledAt ? false : true
        }
        await initDiscordBotEvent.create({
            acc_data: acc_data,
            ...logData
        })
        client.destroy();
    } catch (error) {
        console.log(error)
        client.destroy();
        throw "Message cannot be sent. Check logs for issues.";
    }
}
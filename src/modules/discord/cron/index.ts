import { ISendText, sendText } from './../bot/bot.service';
import initDiscordBotEvent from "../../../database/models/bot-event";
import initDiscordBot from '../../../database/models/discord-bot';
import * as dayjs from "dayjs";
import { Client } from 'discord.js-selfbot-v13';
export class discordJob {
    constructor() {}
    async getAllScheduledJob () {
        try {
            const timestamp = Date.now();
            const result = await initDiscordBotEvent.find();
            const filtered = result.filter((v) => v.scheduledAt !== null);
            for await (const job of filtered) {
                if(timestamp >= job.scheduledAt && !job.sent) {
                    const payload: ISendText = {
                        channel_id: job.channel_id,
                        channel_name: job.channel_name,
                        guild_id: job.guild_id,
                        guild_name: job.guild_name,
                        text: job.text,
                        loginToken: job.acc_data.loginToken
                    }
                    await sendText(payload, false);
                    await initDiscordBotEvent.updateOne({
                        _id: job._id
                    }, {
                        $set: {
                            sent: true
                        }
                    })
                }
            }  
        } catch (error) {
            console.log('err', error)
        }

    }
}

export class discordCron extends discordJob {

    constructor() {
        super();
    }
    async runInterval() {
        console.log('[Discord Scheduled Task has been started]')
        while(true) {
           await this.getAllScheduledJob();
           await delay(2000);
        }
    }

    async awakeBot() {
        await this.initializeBot();
        setInterval(async () => {
            const result = await initDiscordBot.find();
            for await (const [index, b] of result.entries()) {
                const client = new Client({checkUpdate: false});
                await client.login(b.loginToken);
                client.user.setStatus('online');
                // client.user.setActivity('Playing Games', {type: 'PLAYING'})
                // await client.user.setAvatar('https://i.pinimg.com/736x/93/ca/99/93ca99fa3aab09c8c33ef01f3362bf67.jpg')
            }
        }, 60000 * 4)
        // Discord Official: Account will be set to idle after 5 minutes of inactivity
    }

    async initializeBot() {
        const result = await initDiscordBot.find();
        for await (const [index, b] of result.entries()) {
            const client = new Client({checkUpdate: false});
            await client.login(b.loginToken);
            // client.user.setActivity('Playing Games', {type: 'PLAYING'})
            await client.user.setAvatar(randomAvatar[index])
        }
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomAvatar = [
    "https://d2slcw3kip6qmk.cloudfront.net/marketing/techblog/Flaky-cartoon.png",
    "https://i.imgflip.com/7bcuil.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS53XeZpsLTIIXVQHYS3CvzV7wsZyAlIMBxKA&usqp=CAU",
    "https://pbs.twimg.com/media/FLbIwZIXsAYOd8N?format=jpg&name=small",
    "https://i.ytimg.com/vi/FMR4DOvWRIk/maxresdefault.jpg",
    "https://cdn.vox-cdn.com/thumbor/wUH62yPVaZSHLPf0CxmL2gjwDBs=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/19996475/Screen_Shot_2020_05_22_at_2.20.33_PM.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOkFM3iyJZ5oAmKwp95VdGlmgd-K9fVyWW0xyCaMWs1rqNcoELt3ey02YUJA9U2h9uIGU&usqp=CAU"
]
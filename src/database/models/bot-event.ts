import mongoose, { Types } from "mongoose";

export interface IDiscordBotEvent extends mongoose.Document {
    acc_data: AccountData,
    guild_id: string,
    guild_name: string | null,
    channel_id: string,
    channel_name: string | null,
    text: string,
    react: any[],
    is_reply: boolean,
    message_id: string,
    reply_to: string,
    scheduledAt: number,
    sent: boolean
}

interface AccountData {
    acc_id: string,
    username: string,
    loginToken: string
}

export const discordBotEventSchema = new mongoose.Schema<IDiscordBotEvent>({
    acc_data: {
        acc_id: { type: String },
        username: { type: String },
        loginToken: { type: String },
    },
    guild_id: { type: String, required: true },
    guild_name: { type: String, default: null },
    channel_id: { type: String, required: true },
    channel_name: { type: String, default: null },
    text: { type: String, default: null },
    react: [],
    is_reply: { type: Boolean, default: false },
    message_id: { type: String },
    reply_to: { type: String, default: null },
    scheduledAt: { type: Number, default: null },
    sent: { type: Boolean, default: false }
}, {
    timestamps: true
})

const initDiscordBotEvent = mongoose.model<IDiscordBotEvent>("IDiscordBotEvent", discordBotEventSchema);

export default initDiscordBotEvent;
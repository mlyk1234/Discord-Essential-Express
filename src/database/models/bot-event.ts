import mongoose, { Types } from "mongoose";

export interface IDiscordBotEvent extends mongoose.Document {
    acc_data: AccountData,
    guild_id: string,
    channel_id: string,
    text: string,
    react: string,
    is_reply: boolean,
    message_id: string,
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
    channel_id: { type: String, required: true },
    text: { type: String, default: null },
    react: { type: String, default: null },
    is_reply: { type: Boolean, default: false },
    message_id: { type: String },
    scheduledAt: { type: Number, default: null },
    sent: { type: Boolean, default: false }
}, {
    timestamps: true
})

const initDiscordBotEvent = mongoose.model<IDiscordBotEvent>("IDiscordBotEvent", discordBotEventSchema);

export default initDiscordBotEvent;
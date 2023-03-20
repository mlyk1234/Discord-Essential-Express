import mongoose, { Types } from "mongoose";

export interface IDiscordBot extends mongoose.Document {
    acc_id: number;
    loginToken: string;
    username: string;
    emailAddress: string,
    phoneNumber?: string,
    status: string,
    settings: BotSettings[],
    role: string
}

interface BotSettings {
    joinedGuild: string;
    guildName: string;
    listenChannel: string[];
    enabled: boolean;
}

export const discordBotSchema = new mongoose.Schema<IDiscordBot>({
    acc_id: { type: Number },
    loginToken: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    emailAddress: { type: String },
    phoneNumber: { type: String },
    status: { type: String },
    settings: [],
    role: { type: String }
}, {
    timestamps: true
})

const initDiscordBot = mongoose.model<IDiscordBot>("DiscordBot", discordBotSchema);

export default initDiscordBot;
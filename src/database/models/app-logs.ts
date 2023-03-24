import mongoose, { Types } from "mongoose";

export interface IAppLogs extends mongoose.Document {
    category: string;
    error: string;
}

export const discordLogsSchema = new mongoose.Schema<IAppLogs>({
    category: { type: String },
    error: { type: String }
}, {
    timestamps: true
})

const initDiscordLogs = mongoose.model<IAppLogs>("IDiscordBotEvent", discordLogsSchema);

export default initDiscordLogs;
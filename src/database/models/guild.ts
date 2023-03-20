import mongoose, { Types } from "mongoose";

export interface IGuild extends mongoose.Document {
    guild_name: string;
    guild_id: string;
    guild_link: string;
    status: string;
}

export const guildSchema = new mongoose.Schema<IGuild>({
    guild_name: { type: String, required: true },
    guild_id: { type: String, required: true },
    guild_link: { type: String, required: true },
    status: { type: String, default: "A" },
}, {
    timestamps: true
})

const initGuild = mongoose.model<IGuild>("Guild", guildSchema);

export default initGuild;
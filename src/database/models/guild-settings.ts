import mongoose, { Types } from "mongoose";

export interface IGuildSetting extends mongoose.Document {
    guild_id: string;
    form_fields: any;
}

export const guildSettingSchema = new mongoose.Schema<IGuildSetting>({
    guild_id: { type: String, required: true },
    form_fields: { type: Array }
}, {
    timestamps: true
})

const initGuildSetting = mongoose.model<IGuildSetting>("GuildSetting", guildSettingSchema);

export default initGuildSetting;
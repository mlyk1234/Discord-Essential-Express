import mongoose from "mongoose";

export interface ISettings extends mongoose.Document {
    controlAmount: object
}

export const settingSchema = new mongoose.Schema({
    controlAmount: { type: Object }
})

const initSettings = mongoose.model<ISettings>("Settings", settingSchema);

export default initSettings;
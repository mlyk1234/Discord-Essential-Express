import mongoose from "mongoose";

interface ILogsUser extends mongoose.Document {
    wallet: string,
    network: string,
    token: string,
    amount: string,
    timestamp: number
}

export const logUserSchema = new mongoose.Schema({
    wallet: { type: String },
    network: { type: String },
    token: { type: String },
    amount: { type: Number },
    timestamp: { type: Number }
})

const initLogUser = mongoose.model<ILogsUser>("LogUser", logUserSchema);

export default initLogUser;
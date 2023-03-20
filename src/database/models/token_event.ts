import mongoose from "mongoose";

export interface ITokenEvent extends mongoose.Document {
    address: string;
    token: string;
    dateCreated: Date;
}

export const tokenEventSchema = new mongoose.Schema({
    address: { type: String },
    token: { type: String },
    dateCreated: { type: Date }
})

const initTokenEvent = mongoose.model<ITokenEvent>("TokenEvent", tokenEventSchema);

export default initTokenEvent;
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    address: string;
    dateCreated: Date;
}

export const userSchema = new mongoose.Schema({
    address: { type: String },
    dateCreated: { type: Date }
})

const initUser = mongoose.model<IUser>("User", userSchema);

export default initUser;
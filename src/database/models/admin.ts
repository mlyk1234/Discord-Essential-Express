import mongoose, { Types } from "mongoose";

interface JoinedGuild {
    _id: Types.ObjectId,
    name: string
}

export interface IAdmin extends mongoose.Document {
    loginToken: string;
    email: string,
    username: string,
    password: string,
    role: string,
    createAt: Date,
    updatedAt: Date,
}

export const adminSchema = new mongoose.Schema<IAdmin>({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
}, {
    timestamps: true
})

const initAdmin = mongoose.model<IAdmin>("Admin", adminSchema);

export default initAdmin;
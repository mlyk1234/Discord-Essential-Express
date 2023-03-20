import mongoose from "mongoose";

export interface IQuestionnaire extends mongoose.Document {
    type: string,
    level: number,
    text: string,
    status: string
}

export const questionnaireSchema = new mongoose.Schema<IQuestionnaire>({
    type: { type: String, required: true },
    level: { type: Number, default: 1 },
    text: { type: String, required: true, unique: true },
    status: { type: String }
}, {
    timestamps: true
})

const initQuestionnaire = mongoose.model<IQuestionnaire>("Questionnaire", questionnaireSchema);

export default initQuestionnaire;
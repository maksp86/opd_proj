const { Schema, model, Types } = require("mongoose")

const answerField = new Schema({
    _id: { type: Types.ObjectId },
    answer: { type: String },
})

module.exports = model("Submit", new Schema(
    {
        user: { type: Types.ObjectId, ref: "User" },
        value: [answerField],
        task: { type: Types.ObjectId, ref: "Task" },
        isValid: { type: Boolean, default: false },
        reward: { type: Number } //not for tasks, for daily objectives
    }, { timestamps: true }))
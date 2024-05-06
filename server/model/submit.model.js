const { Schema, model, Types } = require("mongoose")

module.exports = model("Submit", new Schema(
    {
        user: { type: Types.ObjectId, ref: "User" },
        value: { type: String },
        task: { type: Types.ObjectId, ref: "Task" },
        isValid: { type: Boolean, default: false },
        reward: { type: Number, default: 0 }
    }, { timestamps: true }))
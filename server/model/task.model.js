const { text } = require("express")
const { Schema, model, Types } = require("mongoose")

module.exports = model("Task", new Schema(
    {
        title: { type: String, default: "Task title" },
        summary: { type: String, default: "Task summary" },
        shortname: { type: String, default: "category" },
        type: { type: String, default: "normal" },
        text: { type: String },
        attachments: { type: [String] },
        difficulty: { type: Types.ObjectId, ref: "Difficulty" },
        parent: { type: Types.ObjectId, ref: "Category" }

    }))
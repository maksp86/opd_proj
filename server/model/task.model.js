const { text } = require("express")
const { Schema, model } = require("mongoose")

module.exports = model("Task", new Schema(
    {
        title: { type: String, default: "Task title" },
        type: { type: String, default: "normal" },
        text: { type: String },
        attachments: { type: [String] }
        
    }))
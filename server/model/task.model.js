const { Schema, model, Types } = require("mongoose")

module.exports = model("Task", new Schema(
    {
        title: { type: String, default: "Task title" },
        summary: { type: String, default: "Task summary" }, //short text on tasks page
        shortname: { type: String, default: "task" }, //url for task e.g /category/task
        text: { type: String },

        type: { 
            type: String,
            enum: ["normal", "test", "quiz", "learning"],
            default: "normal"
         },
        commentable: { type: Boolean, default: true },

        attachments: { type: [String] }, //attachment urls
        
        difficulty: { type: Types.ObjectId, ref: "Difficulty" },
        parent: { type: Types.ObjectId, ref: "Category" },
        owner: { type: Types.ObjectId, ref: "User" }
    }))
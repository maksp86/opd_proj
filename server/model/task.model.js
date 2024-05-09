const { Schema, model, Types } = require("mongoose")

const answerField = new Schema({
    text: { type: String },
    hint: { type: String },
    answer: { type: String },
    variants: [{ type: String }]
})

module.exports = model("Task", new Schema(
    {
        title: { type: String, default: "Task title" },
        summary: { type: String, default: "Task summary" }, //short text on tasks page
        shortname: { type: String, default: "task" }, //url for task e.g /category/task
        text: { type: String },
        commentable: { type: Boolean, default: true },

        attachments: [{ type: Types.ObjectId, ref: "Attachment" }], //attachment urls

        difficulty: { type: Types.ObjectId, ref: "Difficulty" },
        parent: { type: Types.ObjectId, ref: "Category" },
        owner: { type: Types.ObjectId, ref: "User" },

        answerFields: [answerField],
        maxTries: { type: Number, default: 5 }
    }))
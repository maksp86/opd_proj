const { Schema, model, Types } = require("mongoose")

module.exports = model("Comment", new Schema(
    {
        author: { type: Types.ObjectId, ref: "User" },
        text: { type: String, default: "Comment text" },
        parent: { type: Types.ObjectId, ref: "Comment" },
        subject: { type: Types.ObjectId, ref: "Task" }
    }, { timestamps: true }))
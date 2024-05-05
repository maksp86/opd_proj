const { Schema, model, Types } = require("mongoose")

module.exports = model("Attachment", new Schema(
    {
        name: { type: String, default: "attachment" },
        type: {
            type: String,
            enum: ["avatar", "file"],
            default: "file"
        },
        owner: { type: Types.ObjectId, ref: "User" },
        path: { type: String }
    }))
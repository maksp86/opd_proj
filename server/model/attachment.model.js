const { Schema, model, Types } = require("mongoose")

module.exports = model("Attachment", new Schema(
    {
        name: { type: String, default: "category" },
        type: {
            type: String,
            enum: ["profile_pic", "file"],
            default: "file"
        },
        owner: { type: Types.ObjectId, ref: User },
        path: { type: String }
    }))
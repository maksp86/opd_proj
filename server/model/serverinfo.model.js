const { Schema, model, Types } = require("mongoose")

module.exports = model("ServerInfo", new Schema(
    {
        name: { type: String },
        introduction: { type: String },
        contactsText: { type: String },
        attachments: [{ type: Types.ObjectId, ref: "Attachment" }],
    }, { timestamps: true }))
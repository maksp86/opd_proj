const { Schema, model, Types } = require("mongoose")

module.exports = model("User", new Schema(
    {
        username: { type: String },
        name: { type: String, default: "User" },
        passwordHash: { type: String },
        bio: { type: String, default: "" },
        image: { type: Types.ObjectId, ref: "Attachment" },
        role: { type: Types.ObjectId, ref: "UserRole" }
    }))
const { Schema, model, Types } = require("mongoose")

module.exports = model("User", new Schema(
    {
        username: { type: String },
        passwordHash: { type: String },
        bio: { type: String, default: "" },
        image: {type: String },
        role: {type: Types.ObjectId, default: "UserRole" }
    }))
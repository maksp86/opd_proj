const { Schema, model } = require("mongoose")

module.exports = model("User", new Schema(
    {
        username: { type: String },
        passwordHash: { type: String }
    }))
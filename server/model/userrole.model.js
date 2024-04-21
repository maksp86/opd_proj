const { text } = require("express")
const { Schema, model, Types } = require("mongoose")

module.exports = model("UserRole", new Schema(
    {
        name: { type: String, default: "User role name" },
        //Linux like permissions (without executable bit) 4-r 2-w
        permisions: { type: Number, default: 444 }
    }))
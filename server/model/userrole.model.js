const { Schema, model } = require("mongoose")

module.exports = model("UserRole", new Schema(
    {
        name: { type: String, default: "User role name" },
        //Linux like permissions (without executable bit) 4-r 2-w
        permissions: { type: Number, default: 444 }
    }))
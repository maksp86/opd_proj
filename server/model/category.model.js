const { Schema, model, Types } = require("mongoose")

module.exports = model("Category", new Schema(
    {
        title: { type: String, default: "Category title" },
        shortname: { type: String, default: "category" },
        color: { type: String, default: "#FFFFFF" },
        owner: { type: Types.ObjectId, ref: "User" },
        isLearning: { type: Boolean, default: false },
        //Linux like permissions (without executable bit) 4-r 2-w
        permissions: { type: String, default: "644" }
    }))
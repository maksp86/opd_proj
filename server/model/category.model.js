const { Schema, model } = require("mongoose")

module.exports = model("Category", new Schema(
    {
        title: { type: String, default: "Category title" },
        color: { type: String, default: "#FFFFFF" },
        hidden: {type: Boolean, default: false }
    }))
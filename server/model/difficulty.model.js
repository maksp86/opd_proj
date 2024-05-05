const { Schema, model } = require("mongoose")

module.exports = model("Difficulty", new Schema(
    {
        title: { type: String, default: "Difficulty name" },
        value: { type: Number, default: 0 }

    }))
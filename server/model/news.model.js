const { Schema, model } = require("mongoose")

const article = new Schema({
    title: String,
    link: String,
    summary: String,
    date: Number,
    img: String,
    external: Boolean
})

module.exports = model("News", new Schema(
    {
        isScrapped: Boolean,
        articles: [article]
    }, { timestamps: true }))
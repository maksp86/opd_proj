const Router = require("express")
const logger = require("winston")
const RSSParser = require('rss-parser')

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")

const news_router = Router()

news_router.get("/get",
    [rejectIfNotLogined],
    processGetNews
)

const parser = new RSSParser();

async function processGetNews(req, res) {
    const feed = await parser.parseURL('https://www.anti-malware.ru/news1/feed');

    let news = []

    feed.items.slice(0, 10).forEach(item => {
        let article = {
            title: item.title,
            link: item.link,
            summary: item.contentSnippet || item.summary,
            date: Date.parse(item.pubDate)
        }
        if (item.content.includes("img") && item.content.includes("src")) {
            const regex = new RegExp('src="(.*)" alt="(.*)"')
            const res = regex.exec(item.content)
            if (res && res.length > 1) article.img = res[1]
        }
        news.push(article)
    });

    res.status(200).json({ status: "no_error", value: news })
}

module.exports = news_router
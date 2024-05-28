const Router = require("express")
const logger = require("winston")
const RSSParser = require('rss-parser')

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const News = require("../model/news.model")

const news_router = Router()

news_router.get("/get",
    [],
    processGetNews
)

const parser = new RSSParser();

async function GetRSSNews() {
    let scrappedNews = await News.findOne({ isScrapped: true })

    if (scrappedNews && (Date.now() - Date.parse(scrappedNews.updatedAt)) < 3600 * 1000)
        return scrappedNews

    const feed = await parser.parseURL('https://www.anti-malware.ru/news1/feed');

    let newsArr = []

    feed.items.slice(0, 10).forEach(item => {
        let article = {
            title: item.title,
            link: item.link,
            summary: item.contentSnippet || item.summary,
            date: Date.parse(item.pubDate),
            external: true
        }
        if (item.content.includes("img") && item.content.includes("src")) {
            const regex = new RegExp('src="(.*)" alt="(.*)"')
            const res = regex.exec(item.content)
            if (res && res.length > 1) article.img = res[1]
        }
        newsArr.push(article)

    });

    if (!scrappedNews)
        scrappedNews = new News({ isScrapped: true });

    scrappedNews.articles = newsArr;

    await scrappedNews.save();

    return scrappedNews
}

async function processGetNews(req, res) {
    if (req.session.userid && req.session.loginTime) {
        let gotNews = await GetRSSNews()

        return res.status(200).json({ status: "no_error", value: gotNews.articles })
    }
    return res.status(403).json({ status: "error_no_permission" });

}

module.exports = news_router
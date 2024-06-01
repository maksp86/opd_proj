require('dotenv').config()

const express = require("express");
const session = require('express-session')
const cookie_parser = require("cookie-parser")
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");

const logger = require("./logger");
const dbConnect = require("./db");
const { CleanUpTask, ScheduleCleanUp } = require('./cleanUpTask');

const app = express();

async function start() {
    try {
        logger.info("Starting server in %s mode", process.env.NODE_ENV);
        dbConnect();

        app.use(session({
            secret: process.env.SESSIONSECRET,
            cookie: {
                maxAge: 2592000 * (process.env.NODE_ENV === "dev" ? 1 : 1000) //month
            },
            resave: true,
            saveUninitialized: true,
            store: MongoStore.create({
                client: mongoose.connection.getClient(),
                dbName: "site",
                collectionName: "sessions",
                stringify: false,
                autoRemove: "interval",
                autoRemoveInterval: 1
            })
        }))

        app.use(cookie_parser(process.env.SESSIONSECRET))

        app.set('trust proxy', 1);
        app.use(express.json({ extended: true }));

        const noLimiterPaths = ["/api/attachments/get"]

        const limiter = rateLimit({
            windowMs: 2000,
            limit: (process.env.NODE_ENV === "dev" ? 100 : 15),
            message: { status: "error_too_many_requests" },
            skip: (req, res) => req.session.userid && req.session.loginTime && noLimiterPaths.includes(req.originalUrl.split("?").shift())
        })
        app.use(limiter)

        app.use('/api/user', require('./routes/user.routes'))
        app.use('/api/admin', require('./routes/admin.routes'))
        app.use('/api/category', require('./routes/category.routes'))
        app.use('/api/task', require('./routes/task.routes'))
        app.use('/api/difficulty', require('./routes/difficulty.routes'))
        app.use('/api/attachments', require('./routes/attachments.routes'))
        app.use('/api/submit', require('./routes/submit.routes'))
        app.use('/api/stats', require('./routes/stats.routes'))
        app.use('/api/news', require('./routes/news.routes'))

        app.get('/api/healthcheck', (req, res) => { res.status(200).json({ status: "no_error" }) })

        app.use(require('./middleware/errorHandler.middleware'))

        await CleanUpTask()
        ScheduleCleanUp(600)

        app.listen(process.env.PORT, () => { logger.info("Server listening on %s", process.env.PORT) })
    }
    catch (e) {
        logger.error(e.message);
        process.exit(1);
    }
}

start();
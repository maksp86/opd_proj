require('dotenv').config()

const express = require("express");
const session = require('express-session')
const cookie_parser = require("cookie-parser")
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const logger = require("./logger");
const dbConnect = require("./db");

const app = express();

async function start() {
    try {
        logger.info("Starting");
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

        app.use('/api/user', require('./routes/user.routes'))
        app.use('/api/admin', require('./routes/admin.routes'))

        app.listen(process.env.PORT, () => { logger.info("Server listening on %s", process.env.PORT) })
    }
    catch (e) {
        logger.error(e.message);
        process.exit(1);
    }
}

start();
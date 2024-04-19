require('dotenv').config()

const express = require("express");
const logger = require("./logger")
const dbConnect = require("./db");

const app = express();

app.set('trust proxy', 1);
app.use(express.json({ extended: true }));

app.use('/api/user', require('./routes/user.routes'))

async function start() {
    try {
        logger.info("Starting");
        dbConnect();

        app.listen(process.env.PORT, () => { logger.info("Server listening on %s", process.env.PORT) })
    }
    catch (e) {
        logger.error(e.message);
        process.exit(1);
    }
}

start();
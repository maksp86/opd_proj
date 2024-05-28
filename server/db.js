const mongoose = require("mongoose")
const logger = require("winston")
const databaseInit = require("./initDB")

async function connect() {
    try {
        logger.debug("[db] connecting");
        await mongoose.connect(process.env.MONGOURI);

        databaseInit();
    }
    catch (e) {
        logger.error("[db] %s", e.message);
    }
}

module.exports = connect
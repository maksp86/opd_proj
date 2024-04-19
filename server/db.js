const mongoose = require("mongoose")
const logger = require("winston")

async function connect() {
    try {
        logger.debug("[db] connecting");
        await mongoose.connect(process.env.MONGOURI);
    }
    catch (e) {
        logger.error("[db] %s", e.message);
    }
}

module.exports = connect
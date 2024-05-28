const logger = require("winston")

async function errorHandler(err, req, res, next) {
    res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
    logger.error(err instanceof Error ? err.message + "\n" + err.stack : err);
}

module.exports = errorHandler;
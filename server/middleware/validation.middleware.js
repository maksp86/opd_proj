const { validationResult } = require("express-validator")

async function processValidaion(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "validation_failed", errors: errors.array({ onlyFirstError: true }).map((item) => ({ msg: item.msg, path: item.path })) })
    }
    next();
}

module.exports = processValidaion
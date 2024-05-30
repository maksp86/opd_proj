const { validationResult } = require("express-validator")
const mongoose = require("mongoose")
const User = require("../model/user.model")

async function processValidaion(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "validation_failed", errors: errors.array({ onlyFirstError: true }).map((item) => ({ msg: item.msg, path: item.path })) })
    }
    next();
}

async function rejectIfAlreadyLogined(req, res, next) {
    if (req.session.userid && req.session.loginTime)
        return res.status(400).json({ status: "error_already_logined" });
    next()
}

async function rejectIfNotLogined(req, res, next) {
    if (req.session.userid && req.session.loginTime) {
        req.user = await User.findOne({ _id: new mongoose.Types.ObjectId(req.session.userid) });
        if (!req.user) {
            req.session.destroy();
            return res.status(403).json({ status: "error_not_logined" });
        }
        next()
    }
    else
        return res.status(403).json({ status: "error_not_logined" });
}

module.exports = { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined }
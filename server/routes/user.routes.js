const Router = require("express")
const { check } = require("express-validator")
const bcrypt = require('bcrypt')
const logger = require("winston")
const mongoose = require("mongoose")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const User = require("../model/user.model")
const UserRole = require("../model/userrole.model")

const user_router = Router()

//Not so RESTful :(
user_router.post("/create",
    [
        rejectIfAlreadyLogined,
        check('username', "field_empty").isAlphanumeric().isLength({ min: 5, max: 30 }).withMessage("invalid_length"),
        check('name', "field_empty").isString().isLength({ min: 5, max: 100 }).withMessage("invalid_length"),
        check('password', "field_empty").isString().isLength({ min: 10, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ], processRegister);

user_router.post("/login",
    [
        rejectIfAlreadyLogined,
        check('username', "field_empty").isAlphanumeric().isLength({ min: 5, max: 30 }).withMessage("invalid_length"),
        check('password', "field_empty").isString().isLength({ min: 10, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ], processLogin);

user_router.get("/logout", rejectIfNotLogined, processLogout)

user_router.post("/editinfo",
    [
        rejectIfNotLogined,
        check('bio', "field_empty").isString().isLength({ max: 255 }).withMessage("length_too_big"),
        check('name', "field_empty").isString().isLength({ min: 5, max: 100 }).withMessage("invalid_length"),
        processValidaion
    ],
    processEditInfo
)

user_router.post("/editpassword",
    [
        rejectIfNotLogined,
        check('oldpassword', "field_empty").isString().isLength({ min: 10, max: 255 }).withMessage("invalid_length"),
        check('newpassword', "field_empty").isString().isLength({ min: 10, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ],
    processEditPassword
)

async function processEditPassword(req, res) {
    try {
        const { oldpassword, newpassword } = req.body;

        const isValidOldPassword = await bcrypt.compare(oldpassword, req.user.passwordHash)
        if (isValidOldPassword) {
            const newPasswordHash = await bcrypt.hash(newpassword, 10);
            req.user.passwordHash = newPasswordHash;
            await req.user.save();
            res.status(200).json({ status: "no_error" });
        }
        else {
            res.status(400).json({ status: "user_wrong_password" });
        }
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[user.routes] %s", e.message);
    }
}

async function processEditInfo(req, res) {
    try {
        const { bio, name } = req.body;
        await req.user.updateOne({ bio, name })
        res.status(200).json({ status: "no_error" });
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[user.routes] %s", e.message);
    }
}

async function processLogout(req, res) {
    try {
        req.session.destroy();
        res.status(200).json({ status: "no_error" });
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[user.routes] %s", e.message);
    }
}

async function processLogin(req, res) {
    try {
        const { username, password } = req.body;

        const userExists = await User.findOne({ username })
        if (userExists) {
            const isValidPassword = await bcrypt.compare(password, userExists.passwordHash);
            if (isValidPassword) {
                req.session.userid = userExists._id.toString();
                req.session.loginTime = Date.now();
                res.status(200).json({ status: "no_error" });
            }
            else {
                //delay for nasty spammers
                await new Promise(resolve => setTimeout(resolve, 1000));
                res.status(400).json({ status: "user_wrong_password" });
            }
        }
        else {
            res.status(400).json({ status: "user_not_exist" });
        }
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[user.routes] %s", e.message);
    }
}

async function processRegister(req, res) {
    try {
        const { username, password, name } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const userExists = await User.findOne({ username })
        if (userExists) {
            res.status(400).json({ status: "user_exists" });
        }
        else {
            const userRole = await UserRole.findOne({ name: "User" })
            await (new User({ username, passwordHash, role: userRole._id, name })).save();
            res.status(201).json({ status: "no_error" });
        }
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[user.routes] %s", e.message);
    }
}

module.exports = user_router;
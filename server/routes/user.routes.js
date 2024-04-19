const Router = require("express")
const { check } = require("express-validator")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const logger = require("winston")

const processValidaion = require("../middleware/validation.middleware")
const User = require("../model/user.model")

const user_router = Router()

//Not so RESTful :(
user_router.post("/create",
    [
        check('username', "field_empty").isString().isLength({ min: 5, max: 30 }).withMessage("invalid_length"),
        check('password', "field_empty").isString().isLength({ min: 10, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ], processRegister);

user_router.post("/login",
    [
        check('username', "field_empty").isString().isLength({ min: 5, max: 30 }).withMessage("invalid_length"),
        check('password', "field_empty").isString().isLength({ min: 10, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ], processLogin);


async function processLogin(req, res) {
    try {
        const { username, password } = req.body;

        const userExists = await User.findOne({ username })
        if (userExists) {
            const isValidPassword = await bcrypt.compare(password, userExists.passwordHash);
            if (isValidPassword) {
                res.status(201).json({ status: "no_error", value: "" });
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
        const { username, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const userExists = await User.findOne({ username })
        if (userExists) {
            res.status(400).json({ status: "user_exists" });
        }
        else {
            await (new User({ username, passwordHash })).save();
            res.status(201).json({ status: "no_error" });
        }
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[user.routes] %s", e.message);
    }
}

module.exports = user_router;
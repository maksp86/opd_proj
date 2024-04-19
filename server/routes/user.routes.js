const Router = require("express")
const { check } = require("express-validator")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const logger = require("winston")

const processValidaion = require("../middleware/validation.middleware")
const user = require("../model/user.model")

const user_router = Router()

//Not so RESTful :(
user_router.post("/create",
    [
        check('username', "field_empty").isString().isLength({ min: 5, max: 30 }).withMessage("invalid_length"),
        check('password', "field_empty").isString().isLength({ min: 10, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ], processRegister);


async function processRegister(req, res) {
    try {
        const { username, password } = req.body;
        const hashedPass = await bcrypt.hash(pass, process.env.HASHSALT)
        
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] })
        logger.error("[user.routes] %s", e.message)
    }
}

module.exports = user_router;
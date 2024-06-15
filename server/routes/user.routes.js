const Router = require("express")
const { check } = require("express-validator")
const bcrypt = require('bcrypt')
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const User = require("../model/user.model")
const UserRole = require("../model/userrole.model")
const Attachment = require("../model/attachment.model")

const user_router = Router()

//Not so RESTful :(
user_router.post("/register",
    [
        rejectIfAlreadyLogined,
        check('username', "field_empty").isAlphanumeric().isLength({ min: 5, max: 30 }).withMessage("invalid_length"),
        check('name', "field_empty").isString().isLength({ min: 5, max: 100 }).withMessage("invalid_length"),
        check('password', "field_empty").isString().isLength({ min: 8, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ], processRegister);

user_router.post("/login",
    [
        rejectIfAlreadyLogined,
        check('username', "field_empty").isAlphanumeric().isLength({ min: 5, max: 30 }).withMessage("invalid_length"),
        check('password', "field_empty").isString().isLength({ min: 8, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ], processLogin);

user_router.get("/logout", rejectIfNotLogined, processLogout)

user_router.post("/edit",
    [
        rejectIfNotLogined,
        check('bio', "field_empty").isString().isLength({ max: 255 }).withMessage("length_too_big"),
        check('name', "field_empty").isString().isLength({ min: 5, max: 100 }).withMessage("invalid_length"),
        check('image', "field_empty").isMongoId().optional(),
        processValidaion
    ],
    processEditInfo
)

user_router.post("/editpassword",
    [
        rejectIfNotLogined,
        check('oldpassword', "field_empty").isString().isLength({ min: 8, max: 255 }).withMessage("invalid_length"),
        check('newpassword', "field_empty").isString().isLength({ min: 8, max: 255 }).withMessage("invalid_length"),
        processValidaion
    ],
    processEditPassword
)

async function processEditPassword(req, res) {
    const { oldpassword, newpassword } = req.body;

    const isValidOldPassword = await bcrypt.compare(oldpassword, req.user.passwordHash)
    if (isValidOldPassword) {
        if (oldpassword !== newpassword) {
            const newPasswordHash = await bcrypt.hash(newpassword, 10);
            req.user.passwordHash = newPasswordHash;
            await req.user.save();
            res.status(200).json({ status: "no_error" });
        }
        else
            return res.status(400).json({ status: "validation_failed", errors: [{ msg: "user_same_password", path: "newpassword" }] });
    }
    else
        return res.status(400).json({ status: "validation_failed", errors: [{ msg: "user_wrong_password", path: "oldpassword" }] });
}

async function processEditInfo(req, res) {
    const { bio, name, image } = req.body;
    if (!image || Attachment.exists({ _id: image })) {
        await req.user.updateOne({ bio, name, image })
        res.status(200).json({ status: "no_error" });
    }
    else
        res.status(400).json({ status: "validation_failed", errors: [{ msg: "error_not_found", path: "image" }] });

}

async function processLogout(req, res) {
    req.session.destroy();
    res.status(200).json({ status: "no_error" });
}

async function processLogin(req, res) {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username })
    if (userExists) {
        const isValidPassword = await bcrypt.compare(password, userExists.passwordHash);
        if (isValidPassword) {
            req.session.userid = userExists._id.toString();
            req.session.loginTime = Date.now();
            res.status(200).json({ status: "no_error", value: { ...userExists.toObject(), passwordHash: undefined } });
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

async function processRegister(req, res) {
    const { username, password, name } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const userExists = await User.findOne({ username })
    if (userExists) {
        res.status(400).json({ status: "error_already_exists" });
    }
    else {
        const userRole = await UserRole.findOne({ name: "User" })
        let createdUser = new User({ username, passwordHash, role: userRole._id, name })
        await createdUser.save();
        req.session.userid = createdUser._id.toString();
        req.session.loginTime = Date.now();
        res.status(201).json({ status: "no_error", value: { ...createdUser.toObject(), passwordHash: undefined } });
    }
}

module.exports = user_router;
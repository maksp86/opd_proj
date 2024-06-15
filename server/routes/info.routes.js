const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")
const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct, canUserDoIn, canUserDoInUsers, calculateRating, canUserDoInOther } = require("../lib/user.functions")

const ServerInfo = require("../model/serverinfo.model")

const info_router = Router()


info_router.get("/", [],
    processGetInfo
)

info_router.get("/contacts", [],
    processGetContacts
)

info_router.post("/", [
    rejectIfNotLogined,
    check("name", "field_empty").isString(),
    check("contactsText", "field_empty").isString(),
    check("introduction", "field_empty").isString(),
    check("attachments", "field_empty").isArray(),
],
    processSetInfo
)

async function processGetInfo(req, res) {
    const info = await ServerInfo.findOne({}, { contactsText: 0, attachments: 0 }).lean();
    return res.status(200).json({
        status: "no_error",
        value: { ...info, _id: undefined, __v: undefined, createdAt: undefined, updatedAt: undefined }
    })
}

async function processGetContacts(req, res) {
    const info = await ServerInfo.findOne({}).lean();
    return res.status(200).json({
        status: "no_error",
        value: { ...info, _id: undefined, __v: undefined, createdAt: undefined, updatedAt: undefined }
    })
}

async function processSetInfo(req, res) {
    const { name, contactsText, attachments, introduction } = req.body
    req.user = await req.user.populate("role");

    if (await canUserDoInOther(req.user, ["write"])) {
        const info = await ServerInfo.findOne();
        await info.updateOne({ name, contactsText, attachments, introduction })
        return res.status(200).json({ status: "no_error" })
    }
    else
        res.status(403).json({ status: "error_no_permission" })
}

module.exports = info_router
const Router = require("express")
const { check, body } = require("express-validator")
const logger = require("winston")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

const { rejectIfNotLogined, processValidaion } = require("../middleware/user.middleware")
const { getPermissionsStruct, canUserDoInGroup, canUserDoIn } = require("../lib/user.functions")
const Attachment = require("../model/attachment.model")
const User = require("../model/user.model")

let dest = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
}
const storage = multer({ dest, fileFilter: uploadFilter })

const attachment_router = Router()

async function uploadFilter(req, file, cb) {
    if (file.fieldname === "file" && "type" in req.body
        && typeof req.body.type === "string"
        && Attachment.schema.obj.type.enum.includes(req.body.type)
        && typeof req.body.permissions === "string" && !isNaN(req.body.permissions)) {
        switch (req.body.type) {
            case "file":
                req.user = await req.user.populate("role")
                if (await canUserDoInGroup(req.user, ["write"]))
                    cb(null, true)
                else
                    cb("error_no_permission", false)
                break
            case "avatar":
                const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                if (!allowedMimeTypes.includes(file.mimetype))
                    cb("error_wrong_mimetype", false);
                if (file.size > 1 * 1024 * 1024)
                    cb("error_too_big", false);

                cb(null, true)
                break
        }
    }
    else
        cb("validation_failed", false)
}

attachment_router.post("/upload",
    [
        rejectIfNotLogined,
        storage.single("file"),
        (err, req, res, next) => {
            if (err) {
                if (typeof err === "string") {
                    res.status(400).json({ status: err })
                }
                else {
                    logger.error("[attachments.routes.upload] %s", err.message);
                    res.status(500).json({ status: "unexpected_error" })
                }
            }
            else
                next()
        },
    ], processAttachmentUpload)

attachment_router.get("/get",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processAttachmentGet
)

attachment_router.post("/remove",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processAttachmentRemove
)

async function processAttachmentRemove(req, res) {
    const { id } = req.body
    let foundAttachment = await Attachment.findById(id)

    if (!foundAttachment)
        return res.status(404).json({ status: "error_not_found" })

    foundAttachment = await foundAttachment.populate("owner")

    req.user = await req.user.populate("role")

    if (await canUserDoIn(req.user, ["write"], foundAttachment)) {

        await foundAttachment.deleteOne()
        await fs.unlink(path.join(dest, foundAttachment.path), (err) => {
            if (err) throw err
        })
        return res.status(200).json({ status: "no_error" })
    }
    else
        res.status(403).json({ status: "error_no_permission" })
}

async function processAttachmentGet(req, res) {
    const { id } = req.query
    req.user = await req.user.populate("role")

    let foundAttachment = await Attachment.findById(id)

    if (!foundAttachment)
        return res.status(404).json({ status: "error_not_found" })

    if (await canUserDoIn(req.user, ["read"], foundAttachment))
        res.download(path.join(dest, foundAttachment.path), foundAttachment.name)
    else
        res.status(403).json({ status: "error_no_permission" })
}

async function processAttachmentUpload(req, res) {
    if (req.body.type === "avatar")
        req.file.originalname = req.user._id.toString() + "-avatar"
    let attachment = new Attachment({
        owner: req.user._id,
        type: req.body.type,
        path: req.file.filename,
        name: req.file.originalname,
        permissions: req.body.permissions
    })

    await attachment.save()
    
    res.status(200).json({ status: "no_error", value: { _id: attachment._id, name: req.file.originalname } })
}

module.exports = attachment_router;
const Router = require("express")
const { check, body } = require("express-validator")
const logger = require("winston")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

const { rejectIfNotLogined, processValidaion } = require("../middleware/user.middleware")
const { getPermissionsStruct } = require("../lib/user.functions")
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
        && Attachment.schema.obj.type.enum.includes(req.body.type)) {
        switch (req.body.type) {
            case "file":
                req.user = await req.user.populate("role")
                const userPermissions = getPermissionsStruct(req.user.role.permissions)
                if (userPermissions.group.write || userPermissions.others.write)
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
            if (err && typeof err === "string") {
                res.status(400).json({ status: err })
            }
            else
                next()
        },
    ], processAttachmentUpload)


async function processAttachmentUpload(req, res) {
    try {
        let attachment = new Attachment({
            owner: req.user._id,
            type: req.body.type,
            path: req.file.filename,
            name: req.file.originalname
        })
        await attachment.save()
        res.status(200).json({ status: "no_error", value: attachment.toJSON() })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[attachments.routes] %s", e.message);
    }
}

module.exports = attachment_router;
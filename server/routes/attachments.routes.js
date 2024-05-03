const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { rejectIfNotLogined } = require("../middleware/user.middleware")
const Attachment = require("../model/attachment.model")

const attachment_router = Router()

attachment_router.post("/upload",
    [
        rejectIfNotLogined
    ], processAttachmentUpload)


function processAttachmentUpload(req, res) {

}
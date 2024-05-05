const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct } = require("../lib/user.functions")
const Task = require("../model/task.model");

const task_router = Router()

task_router.post("/create",
    [
        rejectIfNotLogined,
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("summary", "field_empty").isString().isLength({ max: 200 }).withMessage("invalid_length"),
        check("shortname", "field_empty").isString().isLength({ max: 20 }).withMessage("invalid_length"),
        check("text", "field_empty").isString(),
        check("type", "field_empty").isIn(Task.schema.obj.type.enum).withMessage("invalid_value"),
        check("commentable", "field_empty").isBoolean(),
        check("attachments", "field_empty").isArray(),
        check("parentCategory", "field_empty").isMongoId(),
        check("difficulty", "field_empty").isMongoId(),
        processValidaion
    ],
    processTaskCreate
)

task_router.post("/edit",
    [
        rejectIfNotLogined,
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("summary", "field_empty").isString().isLength({ max: 200 }).withMessage("invalid_length"),
        check("shortname", "field_empty").isString().isLength({ max: 20 }).withMessage("invalid_length"),
        check("text", "field_empty").isString(),
        check("commentable", "field_empty").isBoolean(),
        check("attachments", "field_empty").isArray(),
        check("difficulty", "field_empty").isMongoId(),
        processValidaion
    ],
    processTaskCreate
)

task_router.post("/remove",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processTaskRemove
)

task_router.get("/get",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processTaskGet
)

task_router.get("/list",
    [
        rejectIfNotLogined,
        check("parent", "field_empty").isMongoId(),
        processValidaion
    ],
    processTaskList
)

async function processTaskCreate(req, res) {

}

async function processTaskRemove(req, res) {
    try {
        const { id } = req.body
        req.user = await req.user.populate("role");

        const userPermissions = getPermissionsStruct(req.user.role.permissions)

        if (userPermissions.group.write || userPermissions.others.write) {
            let foundTask = await Task.findById(id)

            if (!foundTask)
                return res.status(400).json({ status: "error_not_found" });
            foundTask = await foundTask.populate("parent")

            const categoryPermissions = getPermissionsStruct(foundTask.parent.permissions)
            if (req.user.role.name != "Administrator" && !foundTask.owner._id.equals(req.user._id)
                && (!categoryPermissions.others.write || (categoryPermissions.group.write && !req.user.role.equals(foundTask.owner.role)))) {
                return res.status(403).json({ status: "error_no_permission" })
            }

            await foundTask.deleteOne()
            res.status(200).json({ status: "no_error" });
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[task.routes] %s", e.message);
    }
}

async function processTaskGet(req, res) {
    try {
        const { id } = req.body
        req.user = await req.user.populate("role");

        const userPermissions = getPermissionsStruct(req.user.role.permissions)

        if (userPermissions.group.write || userPermissions.others.write) {
            let foundTask = await Task.findById(id)

            if (!foundTask)
                return res.status(400).json({ status: "error_not_found" });
            foundTask = await foundTask.populate("parent")

            const categoryPermissions = getPermissionsStruct(foundTask.parent.permissions)
            if (req.user.role.name != "Administrator" && !foundTask.owner._id.equals(req.user._id)
                && (!categoryPermissions.others.read || (categoryPermissions.group.read && !req.user.role.equals(foundTask.owner.role)))) {
                return res.status(403).json({ status: "error_no_permission" })
            }
            
            foundTask = await foundTask.populate(["parent", "attachments", "difficulty", "owner"])
            res.status(200).json({ status: "no_error", value: foundTask.toJSON() });
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[task.routes] %s", e.message);
    }
}

async function processTaskList(req, res) {

}

module.exports = task_router

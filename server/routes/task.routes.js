const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct, canUserDoIn } = require("../lib/user.functions")
const Task = require("../model/task.model");
const Category = require("../model/category.model");
const Difficulty = require("../model/difficulty.model");

const task_router = Router()

task_router.post("/create",
    [
        rejectIfNotLogined,
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("summary", "field_empty").isString().isLength({ max: 200 }).withMessage("invalid_length"),
        check("shortname", "field_empty").isString().isLength({ max: 20 }).withMessage("invalid_length"),
        check("text", "field_empty").isString(),
        check("commentable", "field_empty").isBoolean(),
        check("attachments", "field_empty").isArray(),
        check("parent", "field_empty").isMongoId(),
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

function checkIsAnswerFields(answerFields) {
    if (answerFields && Array.isArray(answerFields)) {
        for (let i = 0; i < answerFields.length; i++) {
            const field = answerFields[i];
            if ("text" in field && typeof field.text === "string")
                if ("hint" in field && typeof field.hint === "string" || !("hint" in field))
                    if ("answer" in field && typeof field.answer === "string")
                        if (!("hint" in field) || ("variants" in field && Array.isArray(field.variants) && field.variants.every(x => typeof x === "string")))
                            return true;
        }
    }
    return false
}

async function processTaskCreate(req, res) {
    const { title,
        summary,
        shortname,
        text,
        commentable,
        attachments,
        parent,
        difficulty,
        answerFields,
        maxTries } = req.body

    req.user = await req.user.populate("role");
    const userPermissions = getPermissionsStruct(req.user.role.permissions)

    if (userPermissions.group.write || userPermissions.others.write) {
        let foundTask = await Task.findOne({ shortname })
        let parentCategory = undefined;

        if (req.url === "/create") {
            parentCategory = await Category.findById(parent)
        }
        else if (req.url === "/edit") {
            if (!foundTask)
                return res.status(400).json({ status: "error_not_found" });
            parentCategory = await Category.findById(foundTask.parent)
        }

        if (!parentCategory)
            return res.status(400).json({
                status: "error_not_found",
                errors: [{ msg: "error_not_found", path: "parent" }]
            });

        if (!Difficulty.exists(difficulty))
            return res.status(400).json({
                status: "error_not_found",
                errors: [{ msg: "error_not_found", path: "difficulty" }]
            });

        if (!parentCategory.isLearning) {
            let errors = []
            if (!checkIsAnswerFields(answerFields)) {
                errors.push({ msg: "field_invalid", path: "answerFields" })
            }
            if (!maxTries || typeof maxTries !== "number")
                errors.push({ msg: "field_invalid", path: "maxTries" })

            if (errors.length > 0)
                return res.status(400).json({ status: "validation_failed", errors });
        }

        if (canUserDoIn(req.user, ["write"], parentCategory)) {
            if (req.url === "/create") {
                if (foundTask)
                    return res.status(400).json({ status: "error_already_exists" });

                let newTask = new Task({
                    title,
                    summary,
                    shortname,
                    text,
                    commentable,
                    attachments,
                    parent,
                    difficulty,
                    answerFields,
                    maxTries
                })
                await newTask.save()
                return res.status(201).json({
                    status: "no_error",
                    value: { _id: newTask._id.toString(), title, summary, shortname, parent, owner: req.user._id.toString() }
                })
            }
            else if (req.url === "/edit") {
                await foundTask.updateOne({
                    title,
                    summary,
                    text,
                    commentable,
                    attachments,
                    difficulty,
                    answerFields,
                    maxTries
                })

                return res.status(201).json({
                    status: "no_error",
                    value: { _id: foundTask._id.toString(), title, summary, shortname, parent, owner: req.user._id.toString() }
                })
            }
        }

    }
    return res.status(403).json({ status: "error_no_permission" })
}

async function processTaskRemove(req, res) {
    const { id } = req.body
    req.user = await req.user.populate("role");

    const userPermissions = getPermissionsStruct(req.user.role.permissions)

    if (userPermissions.group.write || userPermissions.others.write) {
        let foundTask = await Task.findById(id)

        if (!foundTask)
            return res.status(404).json({ status: "error_not_found" });
        foundTask = await foundTask.populate("parent")

        if (!canUserDoIn(req.user, ["write", "execute"], foundTask.parent)) {
            return res.status(403).json({ status: "error_no_permission" })
        }

        await foundTask.deleteOne()
        res.status(200).json({ status: "no_error" });
    }
    else
        res.status(403).json({ status: "error_no_permission" })
}

async function processTaskGet(req, res) {
    const { id } = req.query
    req.user = await req.user.populate("role");

    let foundTask = await Task.findById(id)

    if (!foundTask)
        return res.status(404).json({ status: "error_not_found" });
    foundTask = await foundTask.populate("parent")

    if (!canUserDoIn(req.user, ["read"], foundTask.parent)) {
        return res.status(403).json({ status: "error_no_permission" })
    }

    foundTask = await foundTask.populate(["attachments", "difficulty", "owner"])
    res.status(200).json({ status: "no_error", value: foundTask.toJSON() });
}

async function processTaskList(req, res) {
    const { parent } = req.query

    const parentCategory = await Category.findById(parent)

    if (!parentCategory)
        return res.status(404).json({ status: "error_not_found" });

    if (canUserDoIn(req.user, ["read"], parentCategory)) {
        let tasks = await Task.find({ parent }, { commentable: 0, attachments: 0, text: 0, maxTries: 0, answerFields: 0 }).lean()
        return res.status(200).json({ status: "no_error", value: tasks })
    }
    else {
        return res.status(403).json({ status: "error_no_permission" })
    }
}

module.exports = task_router

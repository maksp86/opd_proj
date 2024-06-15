const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct, canUserDoIn, canUserDoInGroup } = require("../lib/user.functions")
const Task = require("../model/task.model");
const Category = require("../model/category.model");
const Submit = require("../model/submit.model");
const Difficulty = require("../model/difficulty.model");
const Comment = require("../model/comment.model")
const { getSubComments } = require("../lib/comment.functions")

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

task_router.post("/comment/post",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        check("text", "field_empty").isString().isLength({ max: 255 }).withMessage("invalid_length"),
        check("parent", "field_empty").optional().isMongoId(),
        processValidaion
    ],
    processTaskCommentPost
)

task_router.post("/comment/edit",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        check("comment_id", "field_empty").isMongoId(),
        check("text", "field_empty").isString().isLength({ max: 255 }).withMessage("invalid_length"),
        processValidaion
    ],
    processTaskCommentPost
)

task_router.get("/comment/get",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processTaskCommentGet
)

task_router.post("/comment/remove",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processTaskCommentRemove
)

function checkIsAnswerFields(answerFields) {
    if (answerFields && Array.isArray(answerFields)) {
        let correctFields = 0
        for (let i = 0; i < answerFields.length; i++) {
            const field = answerFields[i];
            if ("text" in field && typeof field.text === "string")
                if ("hint" in field && typeof field.hint === "string" || !("hint" in field))
                    if ("answer" in field && typeof field.answer === "string")
                        if (!("variants" in field) || ("variants" in field && Array.isArray(field.variants) && field.variants.every(x => typeof x === "string")))
                            correctFields++;
        }
        if (correctFields == answerFields.length)
            return true
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

    if (await canUserDoInGroup(req.user, ["write"])) {
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
            if (!maxTries || typeof maxTries !== "number" || maxTries <= 0)
                errors.push({ msg: "field_invalid", path: "maxTries" })

            if (errors.length > 0)
                return res.status(400).json({ status: "validation_failed", errors });
        }

        if (await canUserDoIn(req.user, ["write"], parentCategory)) {
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
                let answersChanged = foundTask.answerFields.length !== answerFields.length ||
                    foundTask.answerFields.some(
                        newfield =>
                            !answerFields.some(field => field.text === newfield.text
                                && field.answer === newfield.answer))

                if (answersChanged) {
                    logger.debug("[task] processTaskEdit answersChanged")
                    await Submit.deleteMany({ task: foundTask._id })
                }

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

    if (await canUserDoInGroup(req.user, ["write", "execute"])) {
        let foundTask = await Task.findById(id)

        if (!foundTask)
            return res.status(404).json({ status: "error_not_found" });
        foundTask = await foundTask.populate("parent")

        if (!(await canUserDoIn(req.user, ["write", "execute"], foundTask.parent))) {
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

    if (!(await canUserDoIn(req.user, ["read"], foundTask.parent))) {
        return res.status(403).json({ status: "error_no_permission" })
    }

    foundTask = await foundTask.populate(["attachments", "difficulty", "owner"])

    if (!(await canUserDoIn(req.user, ["write"], foundTask.parent)))
        foundTask.answerFields.forEach((field) => field.answer = undefined);

    res.status(200).json({ status: "no_error", value: foundTask.toJSON() });
}

async function processTaskList(req, res) {
    const { parent } = req.query

    const parentCategory = await Category.findById(parent)

    if (!parentCategory)
        return res.status(404).json({ status: "error_not_found" });

    if (await canUserDoIn(req.user, ["read"], parentCategory)) {
        let tasks = await Task.find({ parent }, { commentable: 0, attachments: 0, text: 0, maxTries: 0, answerFields: 0 }).lean()
        return res.status(200).json({ status: "no_error", value: tasks })
    }
    else {
        return res.status(403).json({ status: "error_no_permission" })
    }
}

async function processTaskCommentPost(req, res) {
    const { id, text, parent, comment_id } = req.body
    req.user = await req.user.populate("role");

    let foundTask = await Task.findById(id)

    if (!foundTask)
        return res.status(404).json({ status: "error_not_found" });
    foundTask = await foundTask.populate("parent")

    if (!(await canUserDoIn(req.user, ["read"], foundTask.parent)))
        return res.status(403).json({ status: "error_no_permission" })

    let comment = undefined
    if (req.url === "/comment/edit") {
        comment = await Comment.findById(comment_id)

        if (!comment)
            return res.status(404).json({
                status: "validation_failed",
                errors: [{ msg: "error_not_found", path: "parent" }]
            });

        if (!(await canUserDoIn(req.user, ["write"], foundTask.parent)) && !req.user._id.equals(comment.author))
            return res.status(403).json({ status: "error_no_permission" })
    }
    else if (req.url === "/comment/post") {
        let foundParentComment = undefined
        if (parent) {
            foundParentComment = await Comment.findById(parent)
            if (!foundParentComment)
                return res.status(404).json({
                    status: "validation_failed",
                    errors: [{ msg: "error_not_found", path: "parent" }]
                });

            if (foundParentComment.depth >= 2)
                return res.status(404).json({ status: "error_max_depth_reached" })
        }

        comment = new Comment({
            author: req.user._id,
            subject: id,
            parent: foundParentComment ? foundParentComment._id : undefined
        })
    }
    comment.text = text
    await comment.save()
    return res.status(201).json({ status: "no_error", value: comment })
}

async function processTaskCommentGet(req, res) {
    const { id } = req.query
    req.user = await req.user.populate("role");

    let foundTask = await Task.findById(id)

    if (!foundTask)
        return res.status(404).json({ status: "error_not_found" });
    foundTask = await foundTask.populate("parent")

    if (!foundTask.commentable || !(await canUserDoIn(req.user, ["read"], foundTask.parent)))
        return res.status(403).json({ status: "error_no_permission" })

    let comments = await Comment.find({ subject: id, parent: undefined }, { subject: 0 }).populate({
        path: "author",
        select: "username name image"
    }).lean()
    comments = await getSubComments(comments)
    return res.status(200).json({ status: "no_error", value: comments })
}

async function processTaskCommentRemove(req, res) {
    const { id } = req.body
    req.user = await req.user.populate("role");

    let foundComment = await Comment.findById(id).populate({
        path: "subject",
        select: "parent",
        populate: { path: "parent", select: "permissions owner" }
    })

    if (!foundComment)
        return res.status(404).json({ status: "error_not_found" });

    if (!(await canUserDoIn(req.user, ["write"], foundComment.subject.parent)) && !req.user._id.equals(foundComment.author))
        return res.status(403).json({ status: "error_no_permission" })

    await foundComment.deleteOne()
    return res.status(200).json({ status: "no_error" })
}

module.exports = task_router

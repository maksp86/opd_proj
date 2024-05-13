const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct, canUserDoIn } = require("../lib/user.functions")
const Task = require("../model/task.model");
const Category = require("../model/category.model");
const Difficulty = require("../model/difficulty.model");
const Submit = require("../model/submit.model");

const submit_router = Router()

submit_router.post("/",
    [
        rejectIfNotLogined,
        check("answers", "field_empty").isArray(),
        check("task", "field_empty").isMongoId(),
        processValidaion
    ], processSubmitAnswer)

function checkIsAnswerFields(answerFields) {
    if (answerFields && Array.isArray(answerFields)) {
        for (let i = 0; i < answerFields.length; i++) {
            const field = answerFields[i];
            if ("answer" in field && typeof field.answer === "string")
                if ("_id" in field && typeof field._id === "string")
                    return true;
        }
    }
    return false
}

async function processSubmitAnswer(req, res) {
    const { answers, task } = req.body

    req.user = await req.user.populate("role")

    if (!checkIsAnswerFields(answers)) {
        return res.status(400).json({
            status: "validation_failed",
            errors: [{ msg: "field_invalid", path: "answers" }]
        })
    }
    let foundTask = await Task.findById(task)

    if (!foundTask)
        return res.status(400).json({ status: "error_not_found" })

    await foundTask.populate("parent difficulty")

    if (foundTask.parent.isLearning || !await canUserDoIn(req.user, ["read"], foundTask.parent))
        return res.status(403).json({ status: "error_no_permission" })

    let submits = await Submit.find({ user: req.user._id, task: foundTask._id })

    if (submits.some(item => item.isValid))
        return res.status(400).json({ status: "error_already_exists" })

    if (submits.length >= foundTask.maxTries)
        return res.status(400).json({ status: "error_limit_reached" })

    let wrongFields = []

    foundTask.answerFields.forEach(field => {
        let foundAnswer = answers.find(x => field._id.equals(x._id))
        if (!foundAnswer || foundAnswer.answer !== field.answer)
            wrongFields.push(field._id)
    });

    let newSubmit = new Submit({
        user: req.user._id,
        task: foundTask._id,
        value: answers,
        isValid: (wrongFields.length == 0)
    })
    await newSubmit.save()

    let reward = newSubmit.isValid ? foundTask.difficulty.value : undefined;

    return res.status(200).json({ status: "no_error", value: { wrongFields, reward, isValid: (wrongFields.length == 0) } })
}

module.exports = submit_router;
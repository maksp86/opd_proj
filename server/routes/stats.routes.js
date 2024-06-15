const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct, canUserDoIn, canUserDoInUsers, calculateRating } = require("../lib/user.functions")
const Task = require("../model/task.model");
const Category = require("../model/category.model");
const Difficulty = require("../model/difficulty.model");
const Submit = require("../model/submit.model");
const User = require("../model/user.model")

const stats_router = Router()

stats_router.get("/user",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processUserStats
)

stats_router.get("/progress",
    [
        rejectIfNotLogined,
        check("isLearning", "field_empty").isBoolean(),
        processValidaion
    ],
    processGetProgress
)

stats_router.get("/category/progress",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processGetCategoryProgress
)

async function processGetCategoryProgress(req, res) {
    const { id } = req.query

    const foundCategory = Category.findById(id)

    if (!foundCategory)
        return res.status(404).json({ status: "error_not_found" })

    let progress = {}

    const userSubmits = await Submit.find({ user: req.user._id, isValid: true }).lean()

    const tasks = await Task.find({ parent: id }).lean()

    tasks.forEach((task) => {
        if (userSubmits.some(submit => task._id.equals(submit.task)))
            progress[task._id.toString()] = true
    })

    return res.status(200).json({ status: "no_error", value: progress })
}

async function processGetProgress(req, res) {
    const { isLearning } = req.query
    req.user = await req.user.populate("role")

    let progress = {}

    const userSubmits = await Submit.find({ user: req.user._id, isValid: true }).lean()
    const categories = await Category.find({ isLearning }).lean()

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i]
        const tasks = await Task.find({ parent: category._id }).lean()

        const size = tasks.length

        const submitted = tasks.filter(task => userSubmits.some((submit => submit.task.equals(task._id)))).length

        progress[category._id.toString()] = Math.round(submitted / size * 100)
    }

    return res.status(200).json({ status: "no_error", value: progress })
}

async function processUserStats(req, res) {
    const { id } = req.query

    req.user = await req.user.populate("role")

    let foundUser = await User.findById(id, { passwordHash: 0 }).populate("role")

    if (!foundUser)
        return res.status(404).json({ status: "error_not_found" })

    if (foundUser._id.equals(req.user._id) || (await canUserDoInUsers(req.user, ["read"]))) {
        let userRating = await calculateRating(foundUser)

        return res.status(200).json({
            status: "no_error",
            value: {
                foundUser: foundUser.toJSON(),
                rating: userRating,
            }
        })
    }
    else
        return res.status(403).json({ status: "error_no_permission" })
}

module.exports = stats_router
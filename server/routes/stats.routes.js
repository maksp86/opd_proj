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

async function processUserStats(req, res) {
    const { id } = req.query

    req.user = await req.user.populate("role")

    let foundUser = await User.findById(id, { passwordHash: 0 })

    if (!foundUser)
        return res.status(404).json({ status: "error_not_found" })

    if (foundUser._id.equals(req.user._id) || canUserDoInUsers(req.user, ["read"])) {
        let userRating = await calculateRating(foundUser)

        return res.status(200).json({
            status: "no_error",
            value: {
                foundUser: foundUser.toJSON(),
                rating: userRating
            }
        })
    }
    else
        return res.status(403).json({ status: "error_no_permission" })
}

module.exports = stats_router
const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { canUserDoInGroup } = require("../lib/user.functions")
const Difficulty = require("../model/difficulty.model");
const Task = require("../model/task.model");

const difficulty_router = Router()

difficulty_router.post("/create",
    [
        rejectIfNotLogined,
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("value", "field_empty").isNumeric(),
        processValidaion
    ],
    processAddDifficulty)

difficulty_router.post("/edit",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("value", "field_empty").isNumeric(),
        processValidaion
    ],
    processAddDifficulty)

difficulty_router.post("/remove",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processCategoryRemove
)

difficulty_router.get("/list",
    [
        rejectIfNotLogined,
        processValidaion
    ],
    processGetList)

async function processAddDifficulty(req, res) {
    const { value, title } = req.body
    req.user = await req.user.populate("role");

    if (await canUserDoInGroup(req.user, ["write"])) {
        if (req.url === "/create") {
            let newDifficulty = new Difficulty({ value, title });
            await newDifficulty.save();
            res.status(201).json({ status: "no_error", value: newDifficulty.toJSON() });
        }
        if (req.url === "/edit") {
            const id = req.body.id
            let difficulty = await Difficulty.findById(id)

            if (!difficulty)
                return res.status(404).json({ status: "error_not_found" });

            await difficulty.updateOne({ value, title })
            res.status(200).json({ status: "no_error", value: { _id: id, value, title } });
        }
    }
    else
        res.status(403).json({ status: "error_no_permission" })
}

async function processCategoryRemove(req, res) {
    const { id } = req.body
    req.user = await req.user.populate("role");

    if (await canUserDoInGroup(req.user, ["write", "execute"])) {
        let foundDifficulty = await Difficulty.findById(id)

        if (!foundDifficulty)
            return res.status(404).json({ status: "error_not_found" });

        if (await Task.exists({ difficulty: foundDifficulty._id }))
            return res.status(400).json({ status: "error_currently_used" });

        await foundDifficulty.deleteOne()
        res.status(200).json({ status: "no_error" });
    }
    else
        res.status(403).json({ status: "error_no_permission" })
}

async function processGetList(req, res) {
    const difficulties = await Difficulty.find().lean()

    res.status(200).json({ status: "no_error", value: difficulties })
}

module.exports = difficulty_router
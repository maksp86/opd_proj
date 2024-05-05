const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct } = require("../lib/user.functions")
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
    try {
        const { value, title } = req.body
        req.user = await req.user.populate("role");

        const userPermissions = getPermissionsStruct(req.user.role.permissions)

        if (userPermissions.group.write || userPermissions.others.write) {
            if (req.url === "/create") {
                let newDifficulty = new Difficulty({ value, title });
                await newDifficulty.save();
                res.status(201).json({ status: "no_error", value: newDifficulty.toJSON() });
            }
            if (req.url === "/edit") {
                const id = req.body.id
                let difficulty = await Difficulty.findById(id)

                if (!difficulty)
                    return res.status(400).json({ status: "error_not_found" });

                await difficulty.updateOne({ value, title })
                res.status(200).json({ status: "no_error", value: { _id: id, value, title } });
            }
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[difficulty.routes] %s", e.message);
    }
}

async function processCategoryRemove(req, res) {
    try {
        const { id } = req.body
        req.user = await req.user.populate("role");

        const userPermissions = getPermissionsStruct(req.user.role.permissions)

        if (userPermissions.group.write || userPermissions.others.write) {
            let foundDifficulty = await Difficulty.findById(id)

            if (!foundDifficulty)
                return res.status(400).json({ status: "error_not_found" });

            if (await Task.exists({ difficulty: foundDifficulty._id }))
                return res.status(400).json({ status: "error_currently_used" });

            await foundDifficulty.deleteOne()
            res.status(200).json({ status: "no_error" });
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[difficulty.routes] %s", e.message);
    }
}

async function processGetList(req, res) {
    try {
        const difficulties = await Difficulty.find().lean()

        res.status(200).json({ status: "no_error", value: difficulties })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[admin.routes] %s", e.message);
    }
}

module.exports = difficulty_router
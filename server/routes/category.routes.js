const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct, canUserDoIn, canUserDoInGroup } = require("../lib/user.functions")
const { checkPermissions } = require("../lib/validation.functions")
const Category = require("../model/category.model");

const category_router = Router()

category_router.post("/create",
    [
        rejectIfNotLogined,
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("shortname", "field_empty").isString().isLength({ max: 20 }).withMessage("invalid_length"),
        check("color", "field_empty").isHexColor(),
        check("isLearning", "field_empty").isBoolean(),
        check("permissions", "field_empty")
            .isString().isLength({ min: 3, max: 3 })
            .withMessage("invalid_length")
            .custom(checkPermissions).withMessage("field_invalid"),
        processValidaion
    ],
    processCategoryCreate
)

category_router.post("/edit",
    [
        rejectIfNotLogined,
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("shortname", "field_empty").isString().isLength({ max: 20 }).withMessage("invalid_length"),
        check("color", "field_empty").isHexColor(),
        check("isLearning", "field_empty").isBoolean(),
        check("permissions", "field_empty")
            .isString().isLength({ min: 3, max: 3 })
            .withMessage("invalid_length")
            .custom(checkPermissions).withMessage("field_invalid"),
        processValidaion
    ],
    processCategoryCreate
)

category_router.post("/remove",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        processValidaion
    ],
    processCategoryRemove
)

category_router.get("/list",
    [
        rejectIfNotLogined,
        check("isLearning", "field_empty").isBoolean(),
        processValidaion
    ],
    processGetList)

async function processCategoryCreate(req, res) {
    const { title, shortname, color, isLearning, permissions } = req.body

    req.user = await req.user.populate("role");

    if (await canUserDoInGroup(req.user, ["write"])) {
        let foundCategory = await Category.findOne({ shortname })
        if (req.url === "/create") {
            if (foundCategory)
                return res.status(400).json({ status: "error_already_exists" });

            let newCategoty = new Category({ title, shortname, color, isLearning, permissions, owner: req.user._id });
            await newCategoty.save();
            res.status(201).json({ status: "no_error", value: newCategoty.toJSON() });
        }
        if (req.url === "/edit") {

            if (!foundCategory)
                return res.status(404).json({ status: "error_not_found" });

            foundCategory = await foundCategory.populate("owner")

            if (!(await canUserDoIn(req.user, ["write"], foundCategory))) {
                return res.status(403).json({ status: "error_no_permission" })
            }

            await foundCategory.updateOne({ title, color, isLearning, permissions })

            res.status(201).json({ status: "no_error", value: { _id: foundCategory._id, title, shortname, color, isLearning, permissions } });
        }
    }
    else
        res.status(403).json({ status: "error_no_permission" })
}

async function processCategoryRemove(req, res) {
    const { id } = req.body
    req.user = await req.user.populate("role");

    const userPermissions = getPermissionsStruct(req.user.role.permissions)

    if (userPermissions.group.write || userPermissions.others.write) {
        let foundCategory = await Category.findById(id)

        if (!foundCategory)
            return res.status(404).json({ status: "error_not_found" });

        if (!(await canUserDoIn(req.user, ["write", "execute"], foundCategory))) {
            return res.status(403).json({ status: "error_no_permission" })
        }

        await foundCategory.deleteOne()
        res.status(200).json({ status: "no_error" });
    }
    else
        res.status(403).json({ status: "error_no_permission" })
}

async function processGetList(req, res) {
    const { isLearning } = req.query

    req.user = await req.user.populate("role");

    const categories = await Category.find({ isLearning }).populate("owner")
    let filteredCategories = []
    for (let i = 0; i < categories.length; i++) {
        if (await canUserDoIn(req.user, ["read"], categories[i]))
            filteredCategories.push(categories[i])
    }

    res.status(200).json({ status: "no_error", value: filteredCategories })
}

module.exports = category_router;
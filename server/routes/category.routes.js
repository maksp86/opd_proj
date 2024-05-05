const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct } = require("../lib/user.functions")
const Category = require("../model/category.model");

const category_router = Router()

category_router.post("/create",
    [
        rejectIfNotLogined,
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("shortname", "field_empty").isString().isLength({ max: 20 }).withMessage("invalid_length"),
        check("color", "field_empty").isHexColor(),
        check("isLearning", "field_empty").isBoolean(),
        check("permissions", "field_empty").isString().isLength({ min: 3, max: 3 }).withMessage("invalid_length"),
        processValidaion
    ],
    processCategoryCreate
)

category_router.post("/edit",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("shortname", "field_empty").isString().isLength({ max: 20 }).withMessage("invalid_length"),
        check("color", "field_empty").isHexColor(),
        check("isLearning", "field_empty").isBoolean(),
        check("permissions", "field_empty").isString().isLength({ min: 3, max: 3 }).withMessage("invalid_length"),
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
    try {
        const { title, shortname, color, isLearning, permissions } = req.body
        req.user = await req.user.populate("role");

        const userPermissions = getPermissionsStruct(req.user.role.permissions)

        if (userPermissions.group.write || userPermissions.others.write) {
            let foundCategory = await Category.findOne({ shortname })
            if (req.url === "/create") {
                if (foundCategory)
                    return res.status(400).json({ status: "error_already_exists" });

                let newCategoty = new Category({ title, shortname, color, isLearning, permissions, owner: req.user._id });
                await newCategoty.save();
                res.status(201).json({ status: "no_error", value: newCategoty.toJSON() });
            }
            if (req.url === "/edit") {
                const id = req.body.id
                let category = await Category.findById(id)

                if (!category)
                    return res.status(400).json({ status: "error_not_found" });

                category = await category.populate("owner")

                const categoryPermissions = getPermissionsStruct(category.permissions)

                if (req.user.role.name != "Administrator"
                    && (!category.owner._id.equals(req.user._id) && !categoryPermissions.others.write
                        || (categoryPermissions.group.write && !req.user.role.equals(category.owner.role)))) {
                    return res.status(403).json({ status: "error_no_permission" })
                }

                if (foundCategory && !foundCategory._id.equals(id))
                    return res.status(400).json({ status: "error_already_exists" });

                await category.updateOne({ title, shortname, color, isLearning, permissions })

                res.status(201).json({ status: "no_error", value: { _id: id, title, shortname, color, isLearning, permissions } });
            }
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[category.routes] %s", e.message);
    }
}

async function processCategoryRemove(req, res) {
    try {
        const { id } = req.body
        req.user = await req.user.populate("role");

        const userPermissions = getPermissionsStruct(req.user.role.permissions)

        if (userPermissions.group.write || userPermissions.others.write) {
            let foundCategory = await Category.findById(id)

            if (!foundCategory)
                return res.status(400).json({ status: "error_not_found" });

            const categoryPermissions = getPermissionsStruct(foundCategory.permissions)
            if (req.user.role.name != "Administrator" && !foundCategory.owner._id.equals(req.user._id)
                && (!categoryPermissions.others.write || (categoryPermissions.group.write && !req.user.role.equals(foundCategory.owner.role)))) {
                return res.status(403).json({ status: "error_no_permission" })
            }

            await foundCategory.deleteOne()
            res.status(200).json({ status: "no_error" });
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[category.routes] %s", e.message);
    }
}

async function processGetList(req, res) {
    try {
        const { isLearning } = req.query
        const categories = await Category.find({isLearning}).lean()

        res.status(200).json({ status: "no_error", value: categories })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[admin.routes] %s", e.message);
    }
}

module.exports = category_router;
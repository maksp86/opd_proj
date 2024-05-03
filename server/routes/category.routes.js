const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const Category = require("../model/category.model");

const category_router = Router()

category_router.post("/create",
    [
        rejectIfNotLogined,
        check("title", "field_empty").isString().isLength({ max: 100 }).withMessage("invalid_length"),
        check("shortname", "field_empty").isString().isLength({ max: 20 }).withMessage("invalid_length"),
        check("color", "field_empty").isHexColor(),
        check("isLearning", "field_empty").isBoolean(),
        check("permissions", "field_empty").isNumeric(),
        processValidaion
    ],
    processCategoryCreate
)

async function processCategoryCreate(req, res) {
    try {
        const { title, shortname, color, isLearning, permissions } = req.body
        req.user = await req.user.populate("role");
        
        

        let newCategoty = new Category({ title, shortname, color, isLearning, permissions });
        res.status(200).json({ status: "no_error" });
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[user.routes] %s", e.message);
    }
}

module.exports = category_router;
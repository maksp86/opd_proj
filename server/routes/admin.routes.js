const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const UserRole = require("../model/userrole.model");

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")

const admin_router = Router()


admin_router.post("/role/edit",
    [
        rejectIfNotLogined,
        check("name").isString(),
        check("permisions").isNumeric(),
        processValidaion
    ], processRoleEdit)

async function processRoleEdit(req, res) {
    try {
        const { name, permissions } = req.body;
        const selectedRole = await UserRole.findOne({ name })

        if (selectedRole) {
            if (req.user.role == selectedRole._id)
                res.status(400).json({ status: "cant_edit_your_role" })
            else {

            }
        }
        else
            res.status(400).json({ status: "role_not_found" });
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[user.routes] %s", e.message);
    }
}

module.exports = admin_router;
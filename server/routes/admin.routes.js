const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const UserRole = require("../model/userrole.model");
const User = require("../model/user.model");

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct } = require("../lib/user.functions")


const admin_router = Router()


admin_router.post("/role/edit",
    [
        rejectIfNotLogined,
        check("id").isMongoId(),
        check("permissions").isNumeric(),
        processValidaion
    ], processRoleEdit)

admin_router.post("/role/add",
    [
        rejectIfNotLogined,
        check("name").isString(),
        check("permissions").isNumeric(),
        processValidaion
    ], processRoleAdd)

admin_router.post("/role/remove",
    [
        rejectIfNotLogined,
        check("id").isMongoId(),
        processValidaion
    ], processRoleRemove)

admin_router.post("/role/list",
    [
        rejectIfNotLogined,
        processValidaion
    ], processRoleList)

admin_router.post("/user/remove",
    [
        rejectIfNotLogined,
        check("id").isMongoId(),
        processValidaion
    ], processUserRemove)

admin_router.post("/user/edit",
    [
        rejectIfNotLogined,
        check("id").isMongoId(),
        check('bio', "field_empty").isString().isLength({ max: 255 }).withMessage("length_too_big"),
        check('name', "field_empty").isString().isLength({ min: 5, max: 100 }).withMessage("invalid_length"),
        processValidaion
    ], processUserEdit)

async function processRoleEdit(req, res) {
    try {
        const { id, permissions } = req.body;
        const selectedRole = await UserRole.findById(id)
        req.user = await req.user.populate("role");
        const userPermissions = getPermissionsStruct(req.user.permissions)

        if (selectedRole) {
            if (req.user.role._id.toString() === selectedRole._id.toString())
                res.status(400).json({ status: "error_cant_edit_your_role" })
            else if (userPermissions.others.write && userPermissions.others.execute) {
                selectedRole.permissions = permissions
                await selectedRole.save()
                res.status(200).json({ status: "no_error", value: selectedRole.toJSON() })
            }
            else
                res.status(403).json({ status: "error_no_permission" })
        }
        else
            res.status(400).json({ status: "error_not_found" });
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[admin.routes] %s", e.message);
    }
}

async function processRoleAdd(req, res) {
    try {
        const { name, permissions } = req.body;
        const selectedRole = await UserRole.findOne({ name })
        req.user = await req.user.populate("role");
        const userPermissions = getPermissionsStruct(req.user.permissions)

        if (selectedRole)
            return res.status(400).json({ status: "role_exist" });

        if (userPermissions.others.write && userPermissions.others.execute) {
            let createdRole = await UserRole.create({ name, permissions })
            res.status(200).json({ status: "no_error", value: createdRole.toJSON() })
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[admin.routes] %s", e.message);
    }
}

async function processRoleRemove(req, res) {
    try {
        const { id } = req.body;
        const selectedRole = await UserRole.findById(id)
        req.user = await req.user.populate("role");
        const userPermissions = getPermissionsStruct(req.user.permissions)

        if (!selectedRole)
            return res.status(400).json({ status: "error_not_found" });

        if (req.user.role._id.toString() === selectedRole._id.toString())
            return res.status(400).json({ status: "error_cant_edit_your_role" })

        if (userPermissions.others.write && userPermissions.others.execute) {
            await selectedRole.deleteOne()
            return res.status(200).json({ status: "no_error" })
        }
        else
            return res.status(403).json({ status: "error_no_permission" })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[admin.routes] %s", e.message);
    }
}

async function processRoleList(req, res) {
    try {
        const roles = await UserRole.find().lean()
        req.user = await req.user.populate("role");

        res.status(200).json({ status: "no_error", value: roles, userRole: req.user.role.toJSON() })
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[admin.routes] %s", e.message);
    }
}

async function processUserRemove(req, res) {
    try {
        const { id } = req.body;
        const selectedUser = await User.findById(id)
        req.user = await req.user.populate("role");
        const userPermissions = getPermissionsStruct(req.user.permissions)

        if (!selectedUser)
            return res.status(400).json({ status: "error_not_found" });

        let isSameUser = req.user._id.toString() === selectedUser._id.toString()
        if (isSameUser || req.user.username == "admin") {
            res.status(400).json({ status: "error_cant_remove_user" })
        }
        else {
            if (isSameUser) {
                req.sesstion.destroy()
                await selectedUser.deleteOne()
                res.status(200).json({ status: "no_error" })
            }
            else if (userPermissions.others.write && userPermissions.others.execute) {
                await selectedUser.deleteOne()
                res.status(200).json({ status: "no_error" })
            }
            else
                res.status(403).json({ status: "error_no_permission" })
        }
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[admin.routes] %s", e.message);
    }
}

async function processUserEdit(req, res) {
    try {
        const { id, bio, name } = req.body;
        const selectedUser = await User.findById(id).populate("role")
        req.user = await req.user.populate("role");
        const userPermissions = getPermissionsStruct(req.user.permissions)

        if (!selectedUser)
            return res.status(400).json({ status: "error_not_found" });

        let isSameUser = req.user._id.toString() === selectedUser._id.toString()
        let isSameRole = req.user.role._id.toString() === selectedUser.role._id.toString()

        if (isSameUser)
            return res.status(400).json({ status: "use_standart_method" });

        if (isSameRole || !(userPermissions.others.write && userPermissions.others.execute))
            res.status(403).json({ status: "error_no_permission" })
        else {
            selectedUser.bio = bio;
            selectedUser.name = name;
            await selectedUser.save()
            res.status(200).json({ status: "no_error", value: selectedUser.toJSON() })
        }


        await req.user.updateOne({ bio, name })
        res.status(200).json({ status: "no_error" });
    }
    catch (e) {
        res.status(500).json({ status: "unexpected_error", errors: [{ msg: "stupid developer" }] });
        logger.error("[admin.routes] %s", e.message);
    }
}

module.exports = admin_router;
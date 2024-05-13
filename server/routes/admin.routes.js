const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const UserRole = require("../model/userrole.model");
const User = require("../model/user.model");

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct, canUserDoInUsers, canUserDoInOther } = require("../lib/user.functions");
const { Types } = require("mongoose");


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

admin_router.get("/role/list",
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
        check('role', "field_empty").isMongoId(),
        processValidaion
    ], processUserEdit)

admin_router.post("/user/setrole",
    [
        rejectIfNotLogined,
        check("id", "field_empty").isMongoId(),
        check("role", "field_empty").isMongoId(),
        processValidaion
    ], processUserSetRole)

async function processRoleEdit(req, res) {
    const { id, permissions } = req.body;
    const selectedRole = await UserRole.findById(id)
    req.user = await req.user.populate("role");

    if (selectedRole) {
        if (req.user.role._id.equals(selectedRole._id))
            res.status(400).json({ status: "error_cant_edit_your_role" })
        else if (canUserDoInOther(req.user, ["execute"])) {
            selectedRole.permissions = permissions
            await selectedRole.save()
            res.status(200).json({ status: "no_error", value: selectedRole.toJSON() })
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
    else
        res.status(404).json({ status: "error_not_found" });
}

async function processRoleAdd(req, res) {
    const { name, permissions } = req.body;
    const selectedRole = await UserRole.findOne({ name })
    req.user = await req.user.populate("role");

    if (selectedRole)
        return res.status(400).json({ status: "role_exist" });

    if (canUserDoInOther(req.user, ["execute"])) {
        let createdRole = await UserRole.create({ name, permissions })
        res.status(200).json({ status: "no_error", value: createdRole.toJSON() })
    }
    else
        res.status(403).json({ status: "error_no_permission" })
}

async function processRoleRemove(req, res) {
    const { id } = req.body;
    const selectedRole = await UserRole.findById(id)
    req.user = await req.user.populate("role");

    if (!selectedRole)
        return res.status(404).json({ status: "error_not_found" });

    if (await User.exists({ role: id }))
        return res.status(200).json({ status: "error_currently_used" })

    if (canUserDoInOther(req.user, ["execute"])) {
        await selectedRole.deleteOne()
        return res.status(200).json({ status: "no_error" })
    }
    else
        return res.status(403).json({ status: "error_no_permission" })
}

async function processRoleList(req, res) {
    const roles = await UserRole.find().lean()
    req.user = await req.user.populate("role");

    if (!canUserDoInUsers(req.user, ["read"]))
        return res.status(403).json({ status: "error_no_permission" })

    res.status(200).json({ status: "no_error", value: roles, userRole: req.user.role.toJSON() })
}

async function processUserRemove(req, res) {
    const { id } = req.body;
    const selectedUser = await User.findById(id)
    req.user = await req.user.populate("role");

    if (!selectedUser)
        return res.status(404).json({ status: "error_not_found" });

    let isSameUser = req.user._id.equals(selectedUser._id.toString())
    if (isSameUser || req.user.username == "admin") {
        res.status(400).json({ status: "error_cant_remove_user" })
    }
    else {
        if (isSameUser) {
            req.sesstion.destroy()
            await selectedUser.deleteOne()
            res.status(200).json({ status: "no_error" })
        }
        else if (canUserDoInUsers(req.user, ["execute"])) {
            await selectedUser.deleteOne()
            res.status(200).json({ status: "no_error" })
        }
        else
            res.status(403).json({ status: "error_no_permission" })
    }
}

async function processUserEdit(req, res) {
    const { id, bio, name } = req.body;
    const selectedUser = await User.findById(id, { passwordHash: 0 }).populate("role")
    req.user = await req.user.populate("role");

    if (!selectedUser)
        return res.status(404).json({ status: "error_not_found" });

    let isSameUser = req.user._id.equals(selectedUser._id)
    let isSameRole = req.user.role._id.equals(selectedUser.role._id)

    if (isSameUser)
        return res.status(400).json({ status: "use_standart_method" });

    if (isSameRole || !canUserDoInUsers(req.user, ["write"]))
        res.status(403).json({ status: "error_no_permission" })
    else {
        selectedUser.bio = bio;
        selectedUser.name = name;
        await selectedUser.save()
        res.status(200).json({ status: "no_error", value: selectedUser.toJSON() })
    }
}

async function processUserSetRole(req, res) {
    const { id, role } = req.body;
    const selectedUser = await User.findById(id, { passwordHash: 0 }).populate("role")

    req.user = await req.user.populate("role");

    if (!selectedUser)
        return res.status(404).json({ status: "error_not_found" });

    if (!await UserRole.exists(role))
        return res.status(404).json({
            status: "validation_failed",
            errors: [{ msg: "error_not_found", path: "role" }]
        });

    let isSameRole = req.user.role._id.equals(selectedUser.role._id)

    if (isSameRole || !canUserDoInUsers(req.user, ["write", "execute"]))
        res.status(403).json({ status: "error_no_permission" })
    else {
        selectedUser.role = role;
        await selectedUser.save()
        res.status(200).json({ status: "no_error", value: selectedUser.toJSON() })
    }
}

module.exports = admin_router;
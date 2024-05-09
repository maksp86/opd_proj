const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const { processValidaion, rejectIfAlreadyLogined, rejectIfNotLogined } = require("../middleware/user.middleware")
const { getPermissionsStruct } = require("../lib/user.functions")
const Task = require("../model/task.model");
const Category = require("../model/category.model");
const Difficulty = require("../model/difficulty.model");
const Answer = require("../model/answer.model");

const answer_router = Router()

answer_router.post("/submit", [rejectIfNotLogined], processSubmitAnswer)

async function processSubmitAnswer(req, res) {
    res.status(200).json({ status: "no_error" })
}
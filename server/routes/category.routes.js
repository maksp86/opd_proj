const Router = require("express")
const { check } = require("express-validator")
const logger = require("winston")

const Category = require("../model/category.model");

const category_router = Router()



module.exports = category_router;
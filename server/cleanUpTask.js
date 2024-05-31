const logger = require("winston")

const Task = require("./model/task.model")
const Category = require("./model/category.model")
const Difficulty = require("./model/difficulty.model")
const Submit = require("./model/submit.model")
const Attachment = require("./model/attachment.model")
const User = require("./model/user.model")
const fs = require("fs")
const path = require("path")

const uploadsPath = path.join(__dirname, "..", "uploads");

async function DeleteUnusedAttachments() {
    logger.info("[cleanup] Finding unused attachments...")

    const attachments = await Attachment.find().lean()

    const users = await User.find({ image: { $exists: true } }, { image: 1 })
    const tasks = await Task.find({ attachments: { $exists: true, $ne: [] } }, { attachments: 1 })

    const usedAttachments = [...users.map(user => user.image), ...tasks.map(task => task.attachments).flat()].map(item => item.toString())

    let removedIDs = []
    for (let i = 0; i < attachments.length; i++) {
        const id = attachments[i]._id.toString()
        const createdAgo = (Date.now() - attachments[i].createdAt) / 1000
        if (!usedAttachments.includes(id) && createdAgo > 86400) {
            logger.info("[cleanup] Found old unused %s %s", attachments[i].name, id)
            await Attachment.findByIdAndDelete(id)
            await fs.unlink(path.join(uploadsPath, attachments[i].path), (err) => {
                if (err)
                    logger.error("[cleanup] Error while deleting: %s", err.message);
            })
            removedIDs.push(id)
        }
    }

    let remainingItems = attachments
        .filter(item => !removedIDs.includes(item._id.toString()))
        .map(item => item.path)

    const uploadsFiles = fs.readdirSync(uploadsPath)

    for (let i = 0; i < uploadsFiles.length; i++) {
        if (!remainingItems.includes(uploadsFiles[i])) {
            logger.info("[cleanup] Found unused uploaded file %s", uploadsFiles[i])
            await fs.unlink(path.join(uploadsPath, uploadsFiles[i]), (err) => {
                if (err)
                    logger.error("[cleanup] Error while deleting: %s", err.message);
            })
        }
    }
}

async function DeleteUnusedTasks() {
    logger.info("[cleanup] Finding unused tasks/submits...")

    const categories = await Category.find().lean()
    const categoriesIDs = categories.map(category => category._id.toString())

    const tasks = await Task.find({}, { parent: 1 })
    const tasksIDs = tasks.map(task => task._id.toString())

    const submits = await Submit.find({ task: { $exists: true } }, { task: 1 })

    let removedTaskIDs = []
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        const id = task._id.toString()
        if (!categoriesIDs.includes(task.parent.toString())) {
            logger.info("[cleanup] Found unused task %s %s", id, task.title)
            await task.deleteOne()
            removedTaskIDs.push(id)
        }
    }

    for (let i = 0; i < submits.length; i++) {
        const submit = submits[i]
        const taskid = submit.task.toString()
        if (!tasksIDs.includes(taskid) || removedTaskIDs.includes(taskid)) {
            logger.info("[cleanup] Found submit with deleted task %s %s", taskid, submit._id.toString())
            await submit.deleteOne()
        }
    }
}

async function CleanUpTask() {
    await DeleteUnusedTasks()
    await DeleteUnusedAttachments()
}

let intervalId = undefined

function ScheduleCleanUp(interval) {
    intervalId = setInterval(() => { CleanUpTask() }, interval * 1000);
    logger.info("[cleanup] Will clean every %s seconds", interval)
}

module.exports = { CleanUpTask, ScheduleCleanUp }
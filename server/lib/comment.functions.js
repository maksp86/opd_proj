const Comment = require("../model/comment.model")

/**
 * 
 * @param {Comment[]} comments 
 */
async function getSubComments(comments) {
    for (let i = 0; i < comments.length; i++) {
        let children = await Comment.find({ parent: comments[i]._id }, { subject: 0 }).populate({
            path: "author",
            select: "username name image"
        }).lean()
        if (children.length > 0) comments[i].children = await getSubComments(children)
    }
    return comments
}

module.exports = { getSubComments }
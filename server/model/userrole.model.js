const { Schema, model } = require("mongoose")

module.exports = model("UserRole", new Schema(
    {
        name: { type: String, default: "User role name" },
        //Linux like permissions (without executable bit) 
        // users  (4: read user,role list; 2: modify user info; 1: delete/ban users, create/edit roles) 
        // groups (4: read category,tasks,difficulties,submits,attachments,comments;
        //         2: create/edit category,tasks,difficulties, moderate comments; 
        //         1: delete category,tasks,etc)
        // other  (4: read server settings; 6: set server settings; 1: backflip)
        permissions: { type: String, default: "444" }
    }))
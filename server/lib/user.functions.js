const User = require("../model/user.model")
const Category = require("../model/category.model")

function getPermissionsStruct(permissions) {

    // Convert permission number to binary string
    let binaryString = (parseInt(permissions, 8).toString(2)).padStart(9, '0');

    // Extract individual permissions
    let user = binaryString.substring(0, 3);
    let group = binaryString.substring(3, 6);
    let others = binaryString.substring(6, 9);

    // Initialize struct to hold boolean values
    let permissionsStruct = {
        user: {
            read: user[0] === '1',
            write: user[1] === '1',
            execute: user[2] === '1'
        },
        group: {
            read: group[0] === '1',
            write: group[1] === '1',
            execute: group[2] === '1'
        },
        others: {
            read: others[0] === '1',
            write: others[1] === '1',
            execute: others[2] === '1'
        }
    };

    return permissionsStruct;
}

/**
 * 
 * @param {User} user 
 * @param {Array} doWhat 
 * @param {Category} category
 * @returns {boolean} 
 */
async function canUserDoIn(user, doWhat, where) {
    if (!doWhat.every(what => ["read", "write", "execute"].includes(what)))
        throw new Error(doWhat + " not in available actions")

    if (!user.role._id)
        user = await user.populate("role")

    if (!where.owner._id)
        where = await where.populate("owner")

    const categoryPermissions = getPermissionsStruct(where.permissions)
    const userPermissions = getPermissionsStruct(user.role.permissions)

    return doWhat.every(what => {
        return userPermissions.group[what]
            && (where.owner._id.equals(user._id)
                || (categoryPermissions.group[what] && where.owner.role.equals(user.role._id))
                || categoryPermissions.others[what])
    })
}

/**
 * 
 * @param {User} user 
 * @param {Array} doWhat 
 * @returns {boolean} 
 */
async function canUserDoInUsers(user, doWhat) {
    if (!doWhat.every(what => ["read", "write", "execute"].includes(what)))
        throw new Error(doWhat + " not in available actions")

    if (!user.role._id)
        user = await user.populate("role")

    const userPermissions = getPermissionsStruct(user.role.permissions)

    return doWhat.every(what => userPermissions.user[what])
}

/**
 * 
 * @param {User} user 
 * @param {Array} doWhat 
 * @returns {boolean} 
 */
async function canUserDoInGroup(user, doWhat) {
    if (!doWhat.every(what => ["read", "write", "execute"].includes(what)))
        throw new Error(doWhat + " not in available actions")

    if (!user.role._id)
        user = await user.populate("role")

    const userPermissions = getPermissionsStruct(user.role.permissions)

    return doWhat.every(what => userPermissions.group[what])
}

/**
 * 
 * @param {User} user 
 * @param {Array} doWhat 
 * @returns {boolean} 
 */
async function canUserDoInOther(user, doWhat) {
    if (!doWhat.every(what => ["read", "write", "execute"].includes(what)))
        throw new Error(doWhat + " not in available actions")

    if (!user.role._id)
        user = await user.populate("role")

    const userPermissions = getPermissionsStruct(user.role.permissions)

    return doWhat.every(what => userPermissions.others[what])
}


module.exports = { getPermissionsStruct, canUserDoIn, canUserDoInUsers, canUserDoInOther, canUserDoInGroup }
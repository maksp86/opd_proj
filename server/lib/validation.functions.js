
/**
 * 
 * @param {String} value 
 * @returns Boolean
 */
function checkPermissions(value) {
    let values = value.split('').map(x => parseInt(x))
    if (values.some((num) => num > 7 || num < 0)
        || values[0] < 7)
        return false
    return true

}

module.exports = { checkPermissions }
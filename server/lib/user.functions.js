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

module.exports = {getPermissionsStruct}
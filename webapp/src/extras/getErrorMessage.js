const apiErrorMessages = {
    "no_error": "",
    
    "user_wrong_password": "Wrong password",
    "user_not_exist": "User not exist",

    "validation_failed": "Validation failed",
    "field_empty": "Field incorrect",
    "length_too_big": "Input too long",
    "invalid_length": "Invalid length",
    
    "error_cant_edit_your_role": "You can`t change your own role",
    "error_no_permission": "No permission",
    "error_not_found": "Object not found",
    "error_already_exists": "Already exists",
    "error_already_logined": "Already logined"
}

function getErrorMessage(key) {
    return apiErrorMessages[key] || key
}

export default getErrorMessage
const apiErrorMessages = {
    "no_error": "",
    
    "user_wrong_password": "Wrong password",
    "user_not_exist": "User not exist",

    "validation_failed": "Validation failed",
    "field_empty": "Field empty",
    "length_too_big": "Input too long",
    "invalid_length": "Invalid length",
    
    "error_cant_edit_your_role": "You can`t change your own role",
    "use_standart_method": "Use standart method for this action",
    "error_cant_remove_user": "Cannot remove user",
    "error_no_permission": "No permission",
    "error_not_found": "Object not found",
    "error_already_exists": "Already exists",
    "error_already_logined": "Already logined",
    "error_limit_reached": "No more tries",
    "unexpected_error": "Server just got broken :(",
    "error_currently_used": "Item currently used",
    "error_too_many_requests": "Too many requests",
    "field_invalid": "Field incorrect",
    "error_wrong_mimetype": "Wrong file type",
    "error_too_big": "File too big",
    "error_max_depth_reached": "Cannot create nested item"
}

function getErrorMessage(key) {
    return apiErrorMessages[key] || key
}

export default getErrorMessage
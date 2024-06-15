import { passwordStrength } from "check-password-strength";

const weaknessCheckOptions = [
    {
        id: 0,
        value: "too short",
        minDiversity: 0,
        minLength: 0
    },
    {
        id: 1,
        value: "weak",
        minDiversity: 1,
        minLength: 8
    },
    {
        id: 2,
        value: "good",
        minDiversity: 2,
        minLength: 10
    },
    {
        id: 3,
        value: "strong",
        minDiversity: 3,
        minLength: 12
    }
]

function checkPasswordStrength(password, action) {
    if (password.length == 0) return undefined

    let weakness = passwordStrength(password, weaknessCheckOptions).value
    let canProceed = password.length >= 8 ? ` but you can ${action}` : ""
    if (weakness !== "strong")
        return `Password is ${weakness}` + canProceed
    else return undefined
}

export default checkPasswordStrength
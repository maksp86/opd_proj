import { useContext } from "react";
import { UserContext } from "../context/user.context";

function OnlyLogined(props) {
    const userContext = useContext(UserContext)
    if (props.inverse) {
        if (userContext.loggedIn)
            return null
        return props.children
    }
    else {
        if (userContext.loggedIn)
            return props.children
        return null
    }
}

export default OnlyLogined
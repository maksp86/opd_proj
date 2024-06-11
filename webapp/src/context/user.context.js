import { createContext } from "react"

export const UserContext = createContext(
    {
        load: () => { },
        login: () => { },
        logout: () => { },
        user: {},
        updateUser: () => {},
        computedXp: undefined,
        setComputedXp: () => { },
        loggedIn: false,
        updateRequest: false, 
        setUpdateRequest: () => {}
    })
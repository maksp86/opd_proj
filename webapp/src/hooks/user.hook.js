import { useCallback, useState } from "react"

export const useUser = () => {
    const [user, setUser] = useState({});
    const [computedXp, setComputedXp] = useState(undefined);
    const [loggedIn, setLoggedIn] = useState(false);
    const [updateRequest, setUpdateRequest] = useState(true)

    const load = useCallback(() => {
        let userString = localStorage.getItem("user")
        if (userString && userString !== "undefined") {
            setUser(JSON.parse(userString))
            setLoggedIn(true)
            return true
        }
        return false
    }, [])

    const updateUser = useCallback((user) => {
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
    }, [])

    const login = useCallback((user) => {
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        setLoggedIn(true)
    }, [])

    const logout = useCallback(() => {
        setLoggedIn(false);
        setUser({})
        setComputedXp(0);
        localStorage.clear()
        
    }, [])

    return { load, login, logout, user, updateUser, computedXp, setComputedXp, loggedIn, updateRequest, setUpdateRequest }
}
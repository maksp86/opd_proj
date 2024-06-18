import { createContext } from "react"

export const ApiContext = createContext(
    {
        busy: false,
        error: undefined,
        request: (endpoint, method = 'GET', body = undefined, headers = {}) => { },
        clearError: () => { }
    })
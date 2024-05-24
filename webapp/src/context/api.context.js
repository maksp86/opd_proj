import { createContext } from "react"

export const ApiContext = createContext(
    {
        busy: false,
        error: undefined,
        request: () => { },
        clearError: () => { }
    })
import { createContext } from "react"

export const BreadcrumbsContext = createContext(
    {
        lastTask: undefined,
        lastCategory: undefined,
        setLastTask: (task) => {},
        setLastCategory: (category) => {} 
    })
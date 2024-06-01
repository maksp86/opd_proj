import { createContext } from "react"

export const ThemeContext = createContext(
    {
        currentTheme: "light",
        set: () => {},
        load: () => {}
    })
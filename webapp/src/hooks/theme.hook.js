import { useCallback, useState } from "react";

const themes = ["light", "dark"]

export const useTheme = () => {
    const [currentTheme, setCurrentTheme] = useState("light")
    const set = useCallback((theme) => {
        if (themes.includes(theme)) {
            localStorage.setItem("application-theme", theme)
            document.body.setAttribute("data-bs-theme", theme)
            setCurrentTheme(theme)
        }
    }, [])

    const load = useCallback(() => {
        set(localStorage.getItem("application-theme") || "light")
    }, [])

    return { currentTheme, set, load }
}
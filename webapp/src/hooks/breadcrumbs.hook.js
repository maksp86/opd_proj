import { useEffect, useState } from "react"

export const useBreadcrumbs = () => {
    const [lastTask, setLastTask] = useState(undefined)
    const [lastCategory, setLastCategory] = useState(undefined)

    useEffect(() => {
        if (lastCategory)
            localStorage.setItem("lastCategory", JSON.stringify(lastCategory))
        else if (!!localStorage.getItem("lastCategory"))
            setLastCategory(JSON.parse(localStorage.getItem("lastCategory")))

        if (lastTask)
            localStorage.setItem("lastTask", JSON.stringify(lastTask))
        else if (!!localStorage.getItem("lastTask"))
            setLastTask(JSON.parse(localStorage.getItem("lastTask")))

    }, [lastCategory, lastTask])

    return { lastTask, lastCategory, setLastTask, setLastCategory }
}
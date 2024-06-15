import { useEffect, useState } from "react"

export const useServerInfo = () => {
    const [serverInfo, setServerInfo] = useState({})

    const load = () => {
        let info = localStorage.getItem("server_info")
        if (info)
            setServerInfo(JSON.parse(info))
    }

    const set = (info) => {
        setServerInfo(info)
        localStorage.setItem("server_info", JSON.stringify(info))
    }

    return { serverInfo, load, set }
}
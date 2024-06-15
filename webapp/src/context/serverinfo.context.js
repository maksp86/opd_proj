import { createContext } from "react"

export const ServerInfoContext = createContext(
    {
        serverInfo: {},
        load: () => {},
        set: (info) => {}
    })
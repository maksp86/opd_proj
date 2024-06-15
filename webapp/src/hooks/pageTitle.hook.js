import { useCallback, useContext } from "react";
import { ServerInfoContext } from "../context/serverinfo.context";

export const usePageTitle = () => {
    const serverinfo = useContext(ServerInfoContext)

    const set = useCallback((title) => {
        window.document.title = title + ` - ${serverinfo.serverInfo.name}`;
    }, [])

    const setGlobal = useCallback((title) => {
        window.document.title = title;
    }, [])

    return { set, setGlobal }
}
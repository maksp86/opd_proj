import { useCallback } from "react";

export const usePageTitle = () => {
    const set = useCallback((title) => {
        window.document.title = title + " - CTF Navigator";
    }, [])

    const setGlobal = useCallback((title) => {
        window.document.title = title;
    }, [])

    return { set, setGlobal }
}
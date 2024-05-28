import { useRef } from "react"

const an = {
    empty: {
        function: () => {
        }
    }
};

export const useConstructor = (callback = an.empty.function) => {
    const hasBeenCalled = useRef(false);
    if (hasBeenCalled.current) return;
    callback();
    hasBeenCalled.current = true;
}
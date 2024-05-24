import { useCallback, useRef, useState } from "react";

function ApiError(status, httpcode, errors = undefined) {
    this.name = 'ApiError';
    this.errors = errors;
    this.status = status;
    this.httpcode = httpcode;
    this.stack = (new Error()).stack;
}
ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.preventNext = false;
ApiError.prototype.constructor = ApiError;

export const useApi = () => {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(undefined);

    const request = useCallback(
        async (endpoint, method = 'GET', body = undefined, headers = {}) => {
            setBusy(true)
            try {

                if (body && !(body instanceof FormData)) {
                    body = JSON.stringify(body)
                    if (!headers['Content-Type'])
                        headers['Content-Type'] = 'application/json'
                }

                const response = await fetch("/api" + endpoint, { method, body, headers })
                console.log(response)
                const data = await response.json();

                if (!response.ok) {
                    throw new ApiError(data.status, response.status, data.errors)
                }

                setBusy(false)

                return { data }
            } catch (error) {
                setBusy(false)
                setError(error)
            }
        }, [])

    const clearError = useCallback((now = false) => {
        if (error)
            error.preventNext = now;
        setError(undefined)
    }, [])

    return { busy, request, error, clearError, setBusy }
}
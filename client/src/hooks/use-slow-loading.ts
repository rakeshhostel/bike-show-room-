import { useState, useEffect } from "react";

/**
 * Returns true after `delayMs` milliseconds if `isLoading` is still true.
 * Used to show a "server is waking up..." message on Render cold starts.
 */
export function useSlowLoading(isLoading: boolean, delayMs = 6000): boolean {
    const [isSlow, setIsSlow] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsSlow(false);
            return;
        }
        const timer = setTimeout(() => {
            if (isLoading) setIsSlow(true);
        }, delayMs);
        return () => clearTimeout(timer);
    }, [isLoading, delayMs]);

    return isSlow;
}

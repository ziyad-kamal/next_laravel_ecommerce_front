import { useRef, useCallback, useEffect } from "react";

export function useDebounce<T extends (...args: never[]) => unknown>(
    callback: T,
    delay: number = 1000
) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const cleanup = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            cleanup();

            return new Promise<ReturnType<T>>((resolve) => {
                timerRef.current = setTimeout(async () => {
                    try {
                        const result = await callback(...args);
                        resolve(result as ReturnType<T>);
                    } catch (error) {
                        throw error;
                    }
                }, delay);
            });
        },
        [callback, cleanup, delay]
    );

    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    return {
        debouncedFn,
    };
}

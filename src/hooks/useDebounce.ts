import { useRef, useCallback, useEffect } from "react";

interface UseDebounceOptions {
    delay?: number;
    onCleanup?: () => void;
}

export function useDebounce<T extends (...args: unknown[]) => unknown>(
    callback: T,
    options: UseDebounceOptions = {}
) {
    const { delay = 700, onCleanup } = options;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        onCleanup?.();
    }, [onCleanup]);

    // Debounced function
    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            cleanup();

            // Create new AbortController for this request
            abortControllerRef.current = new AbortController();

            return new Promise<ReturnType<T>>((resolve) => {
                timerRef.current = setTimeout(async () => {
                    try {
                        const result = await callback(
                            ...args,
                            abortControllerRef.current
                        );
                        resolve(result as ReturnType<T>);
                    } catch (error) {
                        if (
                            error instanceof Error &&
                            error.name === "AbortError"
                        ) {
                            // Handle abort silently
                            return;
                        }
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
        abort: cleanup,
        abortController: abortControllerRef.current,
    };
}

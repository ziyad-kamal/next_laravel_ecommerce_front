import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Extend Window interface
declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

// Make Pusher available globally
if (typeof window !== "undefined") {
    window.Pusher = Pusher;
}

let echoInstance: Echo<"reverb"> | null = null;

export const getEcho = (token: string | null): Echo<"reverb"> => {
    if (echoInstance) {
        return echoInstance;
    }

    echoInstance = new Echo<"reverb">({
        broadcaster: "reverb",
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
        wsPort: process.env.NEXT_PUBLIC_REVERB_PORT
            ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT)
            : 8080,
        wssPort: process.env.NEXT_PUBLIC_REVERB_PORT
            ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT)
            : 443,
        forceTLS: false,
        enabledTransports: ["ws", "wss"],
        authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        },
    });

    return echoInstance;
};

export const disconnectEcho = (): void => {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
};

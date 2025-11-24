// app/protected/layout.tsx
"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("adminToken");
        if (isAuthenticated) {
            redirect("/users/protected/home");
        }

        setIsLoading(false);
    }, []);

    // Optionally, you can add a loading state here
    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen w-full">
                    <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-primary-color mr-2"></div>
                </div>
            ) : (
                children
            )}
        </>
    );
}

"use client";

import { useEffect } from "react";
import { getSession, useSession } from 'next-auth/react';

export default function SessionRefetchEvents() {
    const {update} = useSession();

    useEffect(() => {
        const refetchSession = async () => {
            console.log("Refetching session due to focus or reconnect...");
            const session = await getSession();
            if (update) {
                await update(session);
            }


            console.log(session);
        };

        window.addEventListener("online", refetchSession);
        window.addEventListener("focus", refetchSession);

        return () => {
            window.removeEventListener("online", refetchSession);
            window.removeEventListener("focus", refetchSession);
        };
    }, []);

    return null;
}

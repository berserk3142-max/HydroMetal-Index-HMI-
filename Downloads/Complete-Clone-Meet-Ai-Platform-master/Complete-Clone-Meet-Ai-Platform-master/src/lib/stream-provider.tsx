"use client";

import {
    StreamVideo,
    StreamVideoClient,
    User,
} from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

interface StreamVideoProviderProps {
    children: ReactNode;
    user: {
        id: string;
        name: string;
        image?: string;
    };
    token: string;
}

export const StreamVideoProvider = ({
    children,
    user,
    token,
}: StreamVideoProviderProps) => {
    const [client, setClient] = useState<StreamVideoClient | null>(null);

    useEffect(() => {
        if (!user || !token) return;

        const streamUser: User = {
            id: user.id,
            name: user.name,
            image: user.image,
        };

        const videoClient = new StreamVideoClient({
            apiKey,
            user: streamUser,
            token,
        });

        setClient(videoClient);

        return () => {
            videoClient.disconnectUser();
            setClient(null);
        };
    }, [user, token]);

    if (!client) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <StreamVideo client={client}>{children}</StreamVideo>;
};

"use client";

import {
    CallControls,
    CallingState,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    useCallStateHooks,
    useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Loader2Icon, PhoneOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VideoCallProps {
    callId: string;
}

export const VideoCall = ({ callId }: VideoCallProps) => {
    const client = useStreamVideoClient();
    const [call, setCall] = useState<ReturnType<typeof client.call> | null>(null);

    useEffect(() => {
        if (!client) return;

        const newCall = client.call("default", callId);
        setCall(newCall);

        newCall.join({ create: true }).catch((err) => {
            console.error("Failed to join call:", err);
        });

        return () => {
            newCall.leave().catch((err) => {
                console.error("Failed to leave call:", err);
            });
        };
    }, [client, callId]);

    if (!call) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <StreamCall call={call}>
            <VideoCallUI />
        </StreamCall>
    );
};

const VideoCallUI = () => {
    const router = useRouter();
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    useEffect(() => {
        if (callingState === CallingState.LEFT) {
            router.push("/meetings");
        }
    }, [callingState, router]);

    if (callingState === CallingState.JOINING) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Joining call...</p>
            </div>
        );
    }

    if (callingState === CallingState.LEFT) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <PhoneOffIcon className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">You have left the call</p>
            </div>
        );
    }

    return (
        <StreamTheme>
            <div className="h-full w-full flex flex-col">
                <div className="flex-1 relative bg-black rounded-lg overflow-hidden">
                    <SpeakerLayout participantsBarPosition="bottom" />
                </div>
                <div className="p-4 flex justify-center">
                    <CallControls />
                </div>
            </div>
        </StreamTheme>
    );
};

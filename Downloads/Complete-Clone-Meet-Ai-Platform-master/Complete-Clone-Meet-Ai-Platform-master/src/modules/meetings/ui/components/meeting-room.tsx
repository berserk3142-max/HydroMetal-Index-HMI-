"use client";

import { StreamVideoProvider } from "@/lib/stream-provider";
import { VideoCall } from "./video-call";
import { useEffect, useState } from "react";
import { Loader2Icon, BotIcon, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MeetingRoomProps {
    meetingId: string;
    meetingName: string;
    agentName: string;
    agentInstructions: string;
    user: {
        id: string;
        name: string;
        image?: string;
    };
}

export const MeetingRoom = ({
    meetingId,
    meetingName,
    agentName,
    agentInstructions,
    user,
}: MeetingRoomProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch("/api/stream/token");
                if (!response.ok) {
                    throw new Error("Failed to fetch token");
                }
                const data = await response.json();
                setToken(data.token);
            } catch (err) {
                setError("Failed to initialize video call");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchToken();
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Setting up your meeting...</p>
                </div>
            </div>
        );
    }

    if (error || !token) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                        <CardDescription>{error || "Failed to load video call"}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (!isJoined) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-lg w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{meetingName}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2 mt-2">
                            <BotIcon className="h-4 w-4" />
                            AI Agent: {agentName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-muted rounded-lg p-4">
                            <h4 className="font-medium mb-2">Agent Instructions:</h4>
                            <p className="text-sm text-muted-foreground">{agentInstructions}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                size="lg"
                                className="w-full"
                                onClick={() => setIsJoined(true)}
                            >
                                <VideoIcon className="mr-2 h-5 w-5" />
                                Join Meeting
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Your camera and microphone will be requested when you join
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-4">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">{meetingName}</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <BotIcon className="h-3 w-3" />
                        {agentName}
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-background rounded-lg border overflow-hidden">
                <StreamVideoProvider user={user} token={token}>
                    <VideoCall callId={meetingId} />
                </StreamVideoProvider>
            </div>
        </div>
    );
};

import { auth } from "@/lib/auth";
import { generateStreamToken } from "@/lib/stream";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = generateStreamToken(session.user.id);

        return NextResponse.json({ token });
    } catch (error) {
        console.error("Failed to generate stream token:", error);
        return NextResponse.json(
            { error: "Failed to generate token" },
            { status: 500 }
        );
    }
}

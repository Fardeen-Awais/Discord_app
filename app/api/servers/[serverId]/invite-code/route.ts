import {v4 as uuidv4} from "uuid"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

/**
 * Handles the PATCH request.
 * @param req - The request object.
 * @param params - The parameters object containing the server ID.
 * @returns The response object.
 */
export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        // Get the current user's profile
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the server ID is provided
        if (!params.serverId) {
            return new NextResponse("Server Id Missing", { status: 400 });
        }

        // Update the server with a new invite code
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4()
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error hai", { status: 500 });
    }
}
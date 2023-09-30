import {v4 as uuidv4} from "uuid"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
    try {
        // Get the current user's profile
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
        }});

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_delete]", error);
        return new NextResponse("Internal Error hai", { status: 500 });
    }
}
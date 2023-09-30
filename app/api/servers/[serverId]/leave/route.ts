import {v4 as uuidv4} from "uuid"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

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

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                member: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                member:{
                    deleteMany:{
                        profileId: profile.id // We are delete profileid so that we can delete all the data associated with profile.id
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_leave]", error);
        return new NextResponse("Internal Error hai", { status: 500 });
    }
}
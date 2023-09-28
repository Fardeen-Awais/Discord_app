import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("UnAuthorized", { status: 401 })
        }

        const server = await db.server.create({
            data: {
                name,
                imageUrl,
                profileId: profile.id,
                inviteCode: uuidv4(),
                channel: {
                    create: { name: "general", profileId: profile.id }
                }, // We create Default general Channel here that why we see its data in prisma by default 
                member: {
                    create: { profileId: profile.id, role: MemberRole.ADMIN }
                }
            }
        });

        return NextResponse.json(server)

    } catch (e) {
        console.log(e)
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}
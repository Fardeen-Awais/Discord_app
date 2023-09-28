import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

// * Making the api for creating an channel

export async function POST(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile()
        const {name,type} = await req.json()

        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")
        if(!profile){
            return new NextResponse("UnAuthorized", { status: 401 })
        }

        if(!serverId){
            return new NextResponse("Server Id Missing", { status: 400 })
        }
        
        if(name=="general"){
            return new NextResponse("Name Cannot Be General", { status: 400 })
        }
        
        const server = await db.server.update({
            where:{
                id: serverId,
                member:{
                    some:{
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channel:{
                    create:{
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
   
            }
        })
        return NextResponse.json(server)
    } catch ( error ) {
        console.error("CHANNEL_POST_ERROR ",error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
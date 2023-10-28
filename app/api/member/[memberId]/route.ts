import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
  ) {
    try {
      const profile = await currentProfile();
      const { searchParams } = new URL(req.url);
  
      const serverId = searchParams.get("serverId");
  
      if (!profile) {
        return new NextResponse("Unauthorized" ,{ status: 401 });
      }
  
      if (!serverId) {
        return new NextResponse("Server ID missing", { status: 400 });
      }
  
      if (!params.memberId) {
        return new NextResponse("Member ID missing", { status: 400 });
      }
  
      const server = await db.server.update({
        where: {
          id: serverId,
          profileId: profile.id,
        },
        data: {
          member: {
            deleteMany: {
              id: params.memberId,
              profileId: {
                not: profile.id
              }
            }
          }
        },
        include: {
          member: {
            include: {
              profile: true,
            },
            orderBy: {
              role: "asc",
            }
          },
        },
      });
  
      return NextResponse.json(server);
    } catch (error) {
      console.log("[MEMBER_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

export async function PATCH(req: Request, {params}:{params:{memberId:string}}){

    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();
    
        const serverId = searchParams.get("serverId");

        if(!serverId){
            return new NextResponse("Server Id Missing", { status: 400 })
        }

        if(!profile) {
            return new NextResponse("UnAuthorized", { status: 401 })
        }        
        if(!params.memberId) {
            return new NextResponse("MemberId is missing", { status: 400 })
        }        

        // TODO:  Now after getting the memberId we need to update the server with the new role
        const server =  await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                member:{
                    update:{
                        where:{
                            id:params.memberId,
                            profileId:{
                                not:profile.id
                            } // Preventing admin from changing his own role
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include:{
                member:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:'asc'
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.error("[MEMBER_ID_PATCH]", error);
        return new NextResponse("Internal Server Error", {status:500});
    }
}
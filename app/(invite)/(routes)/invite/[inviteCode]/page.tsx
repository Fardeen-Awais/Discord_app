import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params:{
        inviteCode:string
    }    
}
const InviteCodePage = async({params}:InviteCodePageProps) =>{
    const profile = await currentProfile();

    if(!params.inviteCode){
        return redirect('/')
    }
    if(!profile){
        return redirectToSignIn()
    }

    const CheckUserAlreadyExist = await db.server.findFirst({
        where:{
            inviteCode:params.inviteCode,
            member:{
                some:{
                    profileId:profile?.id
                }
            }
        }
    })

    if(CheckUserAlreadyExist){
        console.log("He is already in the server")
        return redirect(`/servers/${CheckUserAlreadyExist.id}`)
    }

    const server = await db.server.update({
        where:{
            inviteCode:params.inviteCode,
        },
        data:{
            member:{
                create:[
                    {
                        profileId:profile.id,
                    }
                ]
            }
        }
    })

    if(server){
        return  redirect(`/servers/${server.id}`)
    }

    return null
}
export default InviteCodePage
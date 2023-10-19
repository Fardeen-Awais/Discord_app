import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/Chat-header";
interface ChannelIdPageProps{
    params:{
        serverId:string;
        channelId:string;
    }
}

const ChannelIdPage = async({params}:ChannelIdPageProps)=>{
    const profile = await currentProfile()
    if(!profile){
        return redirectToSignIn()
    }
    const channel = await db.channel.findUnique({
        where:{id:params.channelId,}
    }) 
    const member = await db.member.findFirst({
        where:{serverId:params.serverId,profileId:profile.id}
    })
    if(!channel || !member){ 
        redirect("/")
    }
    return(
        <div className="bg-white dark:bg-[#323335] flex flex-col w-screen md:w-[450px] overflow-hidden">
            <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
        </div>
    )
}

export default ChannelIdPage
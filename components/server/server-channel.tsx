'use client'

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Headphones, Lock, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../navigation/action-tooltip";
import { useModalStore } from "@/hook/use-modal-store";


interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Headphones,
    [ChannelType.VIDEO]: Video,
}
const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const {onOpen} = useModalStore()
    const router = useRouter()
    const params = useParams()

    const Icon = iconMap[channel.type]
    // const onclick = () => {
    //     router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
    // }
    const onAction = () => {
        onOpen("deleteChannel",{server,channel})
    }
    return (
        <button className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700 dark:hover:bg-zinc-700/30 transition-all mb-1", params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <Icon className="flex-shrink-0 w-4 h-4 text-zinc-500 hover:text-zinc-400" />
            <p className={cn(`line-clamp-1 font-semibold text-sm text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-300 transition-all`, params.channelId === channel.id && "text-primary dark:text-zinc-200 group-hover:text-white")}>
                {channel.name}
            </p>
            {channel.name !== "general" && role != MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit onClick={()=>onOpen("editChannel",{server,channel})} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
                    </ActionTooltip>
                    <ActionTooltip label="trash">
                        <Trash onClick={()=>onOpen("deleteChannel",{server,channel})} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
                    </ActionTooltip>
                </div>
            )}
            {channel.name === 'general' && (
                <Lock className="ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
            )}
            
        </button>
    )
}

export default ServerChannel
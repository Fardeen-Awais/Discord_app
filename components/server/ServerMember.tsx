'use client'
import { cn } from "@/lib/utils"
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import UserAvatar from "../user-avatar"

interface ServerMemberProps{
    member: Member & {profile: Profile}
    server: Server
}
const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-3 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-3 text-red-500' />,
}

const ServerMember = ({ member, server}:ServerMemberProps) => {
    const router = useRouter()
    const params = useParams()

    const icon  = roleIconMap[member.role]
  return (
    <button className={cn(`group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1`,params?.memberId===member.id &&"bg-zinc-700/20 dark:bg-zinc-700")}><UserAvatar className="h-3 w-3" src={member.profile.imageUrl}/><p className={cn(`font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 transition`,params.channelId===member.id&&"text-primary dark:text-zinc-200 dark:group-hover:text-white")}>{member.profile.name}</p>{icon}</button>

  )
}

export default ServerMember
'use client'

import { ServerWithMemberWithProfile } from "@/types"
import { ChannelType, MemberRole } from "@prisma/client"
import { ActionTooltip } from "../navigation/action-tooltip"
import { Button } from "../ui/button"
import { Plus, Settings } from "lucide-react"
import { useModalStore } from "@/hook/use-modal-store"


// TODO: Continue by making ServerSectionProps
interface ServerSectionProps {
  label: string,
  role: MemberRole,
  sectionType: 'channel' | 'member',
  channelType?: ChannelType,
  server?: ServerWithMemberWithProfile
}
const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
  const {onOpen} = useModalStore()
  return (
    <div className="flex items-center justify-between my-2">
      <p className="text-xs uppercase font-semibold dark:text-zinc-400 text-zinc-500">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channel' && (
        <ActionTooltip label="Create Channel" side="top">
          <Button onClick={()=>onOpen("createChannel",{channelType})} className="bg-transparent hover:bg-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-all">
            <Plus className="h-4 w-4"/>
          </Button>
        </ActionTooltip>
      )}
      {role===MemberRole.ADMIN && sectionType === "member" &&(
         <ActionTooltip label="Manage Channel" side="top">
         <Button onClick={()=>onOpen("members",{server})} className="bg-transparent hover:bg-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-all">
          <Settings className="w-5 h-5"/> 
         </Button>
       </ActionTooltip>
      )} 
    </div>
  )
}

export default ServerSection
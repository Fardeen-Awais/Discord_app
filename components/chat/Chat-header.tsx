import { Hash, Menu } from "lucide-react"
import MobileToggleMenu from "../Mobile-toggle"
//TODO: Video 7:30:52

interface ChatHeaderProps {
    serverId: string
    name:string
    type: "channel" | "conversation"
}

const ChatHeader = ({ serverId, name, type }: ChatHeaderProps) => {
  return (
    <div className="text-md border-neutral-200 dark:border-neutral-800 border-b-2 font-semibold px-3 flex items-center h-12">
        <MobileToggleMenu serverId={serverId}/>
        {type === "channel" && (
          <Hash className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mr-2"/>
        )}
        <p className="font-semibold text-muted dark:text-white text-gray-950 ">
          {name}
        </p>
    </div>
  )
}

export default ChatHeader
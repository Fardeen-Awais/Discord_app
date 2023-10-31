'use client'

import { Fragment } from "react"
import { Member, Message, Profile } from "@prisma/client"
import { format } from 'date-fns'
import ChatWelcome from "./Chat-Welcome"
import { useChatQuery } from "@/hook/use-chat-query"
import { Loader2 } from "lucide-react"
import { type } from "os"
import ChatItem from "./ChatItem"


type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}
interface ChatMessageProps {
    name: string
    member: Member
    chatId: string
    apiUrl: string
    socketUrl: string
    socketQuery: Record<string, string>
    paramKey: "channelId" | "conversationId"
    paramValue: string // Messages
    type: "channel" | "conversation"
}

const DATE_FORMATE = "d MMM yyyy, HH:mm"

const ChatMessage = ({ name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessageProps) => {
    const queryKey = `chat:${chatId}`
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading Message ...</p>
            </div>
        )
    }
    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading Message ...</p>
            </div>
        )
    }
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome
                type={type}
                name={name}
            />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            // <div key={message.id}>{message.content}</div>
                            <ChatItem key={message.id} id={message.id} content={message.content} member={message.member} currentMember={member} fileUrl={message.fileUrl} deleted={message.deleted} timestamps={format(new Date(message.createdAt), DATE_FORMATE)} isUpdated={message.updatedAt !== message.createdAt} socketUrl={socketUrl} socketQuery={socketQuery} />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default ChatMessage
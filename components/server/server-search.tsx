'use client'
import { useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { useParams, useRouter } from "next/navigation"

interface ServerSidebarProps {
    data: {
        label: string,
        type: 'channel' | 'member',
        data: {
            icon: React.ReactNode,
            name: string
            id: string
        }[] | undefined
    }[]
}
const ServerSearch = (data: ServerSidebarProps) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const param = useParams()
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(true)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    })

    const onClick = ({id,type}:{id:string,type:'channel'|'member'}) => {
        if(type === 'member' ){
            router.push(`/servers/${param.serverId}/conversation/${id}`) // if type member we will user send it to the route of the selected member for one to one conversation.
        }
        if(type === 'channel' ){
            router.push(`/servers/${param.serverId}/channels/${id}`) // if type channel we will user send it to the route of the selected channel.
        }
    }
    return (
        <>
            <button onClick={() => setOpen(true)} className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:bg-zinc-700/50 transition-all">
                <SearchIcon className="h-4 w-4 mx-1 text-zinc-500" />
                <p className="text-sm text-zinc-500 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">Search</p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button> 
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all Channels and members" />
                <CommandList>
                    <CommandEmpty>
                        No Result Found
                    </CommandEmpty>
                    {data.data.map(({ label, type, data }) => {
                        if (!data?.length) return null

                        return (
                            <CommandGroup key={label} heading={label}>
                                {data.map(({ id, name, icon }) => {
                                    return (
                                        <CommandItem key={id} onSelect={()=> onClick({id,type})}>
                                            {icon}
                                            <span className="px-1">{name}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default ServerSearch
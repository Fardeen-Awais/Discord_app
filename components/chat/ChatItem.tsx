'use client'
import * as z from 'zod'
import qs from 'query-string'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Member, MemberRole, Profile } from "@prisma/client";
import { Record } from "@prisma/client/runtime/library";
import UserAvatar from "../user-avatar";
import { ActionTooltip } from "../navigation/action-tooltip";
import { Edit, FileIcon, FileType, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';

interface ChatItemProps {
    id: string;
    content: string
    member: Member & {
        profile: Profile;
    };
    timestamps: string;
    fileUrl?: null | string
    deleted: boolean
    currentMember: Member
    isUpdated: boolean
    socketUrl: string
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />
}
const formSchemas = z.object({
    content: z.string().min(1),
})

const ChatItem = ({ id, content, member, timestamps, fileUrl, deleted, currentMember, isUpdated, socketUrl, socketQuery }: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsEditing(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])


    const form = useForm<z.infer<typeof formSchemas>>({
        resolver: zodResolver(formSchemas),
        defaultValues: {
            content: content
        }
    })
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchemas>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            })
            await axios.patch(url, values)
            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        form.reset({
            content: content
        })
    }, [content])

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === MemberRole.ADMIN
    const isModerator = currentMember.role === MemberRole.MODERATOR
    const isOwner = currentMember.id === member.id
    const isPdf = fileType === "pdf" && fileUrl;
    const isImage = !isPdf && fileUrl;

    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner;

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition-all w-full">
            <div className="group flex gap-x-2 items-start w-full">

                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar className="" src={member.profile.imageUrl} />
                </div>

                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm">{member.profile.name}</p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>

                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            {timestamps}
                        </span>
                    </div>
                    {isImage && (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
                            <Image src={fileUrl} alt={content} fill className="object-cover" />
                        </a>
                    )}
                    {isPdf && (
                        <div className="">
                            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10 '>
                                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
                                <a href={fileUrl} target='_blank' rel='noopner noreferrer' className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>
                                    PDF file
                                </a>
                            </div>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300 ",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>)}
                    {isEditing && !fileUrl && (
                        <Form {...form}>
                            <form className='flex items-center w-full gap-x-2 pt-2' onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name='content'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormControl>
                                                <div className='relative w-full'>
                                                    <Input disabled={isLoading} className='p-2 bg-zinc-200/90 dark:bg-zinc-700/50 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200' placeholder='Edited Message' />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                <Button disabled={isLoading} size={'sm'} variant={'primary'}>
                                    Save
                                </Button>
                            </form>
                            <span className='text-[10px] mt-1 text-zinc-400'>
                                Press Escape to cancel, enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-0 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="Edit">
                            <Edit onClick={() => setIsEditing(true)} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>

                    )}
                    <ActionTooltip label="delete">
                        <Trash className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}

export default ChatItem
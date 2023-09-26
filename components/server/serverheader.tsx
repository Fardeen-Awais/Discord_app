'use client'
import { ServerWithMemberWithProfile } from '@/types'
import { MemberRole } from '@prisma/client';
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, PlusCircle, SettingsIcon, Trash, UserPlus, Users } from 'lucide-react';
import { useModalStore } from '@/hook/use-modal-store';

interface ServerHeaderProps{
server:ServerWithMemberWithProfile;
    role?: MemberRole;
}

function ServerHeader({server,role}:ServerHeaderProps) {
    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR

    const {onOpen} = useModalStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full text-md font-semibold px-5 flex items-center h-12 border-neutral-200 dark:border-neutral-700 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name} 
          <ChevronDown className='h-5 w-5 ml-auto'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem onClick={() => onOpen("invite",{server:server})} className='text-indigo-400'>
            Invite People
            <UserPlus className='w-4 h-4 ml-auto'/>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem onClick={()=>onOpen("editServer",{server:server})} className=''>
            Server Setting 
            <SettingsIcon className='w-4 h-4 ml-auto'/>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className=''>
            Manage Members
            <Users className='w-4 h-4 ml-auto'/>
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className=''>
            Create Channel
            <PlusCircle className='w-4 h-4 ml-auto'/>
          </DropdownMenuItem>
        )}
        {
          isModerator && (
            <DropdownMenuSeparator/>
          )
        }
        {isAdmin && (
          <DropdownMenuItem className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
            Delete Server
            <Trash className='w-4 h-4 ml-auto'/>
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
            Leave Server
            <LogOut className='w-4 h-4 ml-auto'/>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader
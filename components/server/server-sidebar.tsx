import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import ServerHeader from './serverheader'

// Define the interface for props passed to ServerSidebar component
interface ServerSidebarProps {
  serverId: string,
}

// ServerSidebar component
const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {

  // Get the current profile
  const profile = await currentProfile()
  if (!profile) {
    return redirect('/')
  }

  // Retrieve the server data from the database
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channel: { // Include the channels associated with the server
        orderBy: {
          createAt: 'asc',
        }
      },
      member: { // Include the members associated with the server
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        }
      }
    }
  });

  // Filter the channels based on their type
  const textChannels = server?.channel.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channel.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channel.filter((channel) => channel.type === ChannelType.VIDEO)

  // Filter the members based on the current profile
  const members = server?.member.filter((member) => member.profileId === profile.id)

  if (!server) {
    return redirect('/')
  }

  // Get the role of the current profile in the server
  const role = server.member.find((member) => member.profileId === profile.id)?.role

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
        <ServerHeader
        server={server}
        role={role}
        />

    </div>
  )
}

export default ServerSidebar
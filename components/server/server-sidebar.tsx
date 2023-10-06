import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import ServerHeader from './serverheader'
import { ScrollArea } from '../ui/scroll-area'
import ServerSearch from './server-search'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { Separator } from '../ui/separator'
import ServerSection from './server-section'
import { channel } from 'diagnostics_channel'
import ServerChannel from './server-channel'
import ServerMember from './ServerMember'

// Define the interface for props passed to ServerSidebar component
interface ServerSidebarProps {
  serverId: string,
}
const iconMap = {
  [ChannelType.TEXT]: '📩',
  [ChannelType.AUDIO]: '🎧',
  [ChannelType.VIDEO]: '🎥',
}
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-3 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-3 text-red-500' />,
};
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
  const role = server.member.find((member) => member.profileId === profile.id)?.role || 'GUEST';
  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ServerHeader
        server={server}
        role={role}
      />
      <ScrollArea className='flex-1 px-3 space-y-[2px]'> {/* flex-1 helps us to fill up available space  */}
        <div className='mt-2'>
          <ServerSearch data={[{ label: "Text Channels", type: "channel", data: textChannels?.map((channel) => ({ icon: iconMap[channel.type], name: channel.name, id: channel.id })) }, { label: "Audio Channels", type: "channel", data: audioChannels?.map((channel) => ({ icon: iconMap[channel.type], name: channel.name, id: channel.id })) }, { label: "Video Channels", type: "channel", data: videoChannels?.map((channel) => ({ icon: iconMap[channel.type], name: channel.name, id: channel.id })) },
          { label: "Members", type: "member", data: members?.map((member) => ({ icon: roleIconMap[member.role], name: member.profile.name, id: member.id })) }
          ]} />
        </div>
        <Separator className='bg-zinc-300 dark:bg-zinc-700 rounded-md my-2' />
        {!!textChannels?.length && ( // The double exclamation marks (!!) are used as a shorthand way to convert a value to a boolean.
          <div className='mb-2'>
            <ServerSection sectionType="channel" channelType={ChannelType.TEXT} server={server} role={role} label="Text Channels" />
            {textChannels.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!audioChannels?.length && ( // The double exclamation marks (!!) are used as a shorthand way to convert a value to a boolean.
          <div className='mb-2'>
            <ServerSection sectionType="channel" channelType={ChannelType.AUDIO} server={server} role={role} label="Voice Channels" />
            {audioChannels.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!videoChannels?.length && ( // The double exclamation marks (!!) are used as a shorthand way to convert a value to a boolean.
          <div className='mb-2'>
            <ServerSection sectionType="channel" channelType={ChannelType.VIDEO} server={server} role={role} label="Video Channels" />
            {videoChannels.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!members?.length && ( // The double exclamation marks (!!) are used as a shorthand way to convert a value to a boolean.
          <div className='my-10'>
            <ServerSection sectionType="member" server={server} role={role} label="Members" />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server}/>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar
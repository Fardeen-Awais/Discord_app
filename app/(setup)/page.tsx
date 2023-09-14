import React from 'react'
import { intialProfile } from '@/lib/initial-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { UserButton } from "@clerk/nextjs";
import InitialModel from '@/components/modals/InitialModel';

const SetupPage = async () => {
  // Fetch initial profile data
  const profile = await intialProfile()

  // Find the first server that has a member with the corresponding profileId
  const server = await db.server.findFirst({
    where: {
      member: {
        some:{ 
          profileId: profile.id 
        }
      }
    }
  }) // This code snippet uses the db object to find the first server that satisfies a specific condition. The condition is that the server must have at least one member with a matching profileId to the profile object. The result is stored in the server variable.

  if(server){
    // If a server with the corresponding ProfileId is found, redirect the user to the server page
    redirect(`/servers/${server.id}`)
  }

  return ( <InitialModel/>
  )
}

export default SetupPage
"use client"
import { useEffect, useState } from "react"
import {LiveKitRoom,VideoConference} from "@livekit/components-react"
import '@livekit/components-styles';

import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if(!user?.firstName || !user?.lastName) return;
        const name = `${user.firstName} ${user.lastName}`;

        (async () => {
            try{
                const resp = await fetch(
                    `/api/get-participant-token?room=${chatId}&username=${name}`
                  );
                const data = await resp.json();
                setToken(data.token);
            }
            catch(e){
                console.log(`Error: ${e}`);
                
            }
        })()
    },[user?.firstName, user?.lastName, chatId]) //? Why we providet this dependency array?
    //* In the dependencies array [user?.firstName, user?.lastName, chatId] is provided to the useEffect hook. This means that the effect will be re-run whenever the values of user?.firstName, user?.lastName, or chatId change.

    if (token === "") {
        return <div>Getting token...</div>;
    }

    return (
        <LiveKitRoom
          video={video}
          audio={audio}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: '100dvh' }}
        >
            <VideoConference/>
        </LiveKitRoom>
      );
}
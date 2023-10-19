import { Member, Profile, Server } from "@prisma/client";
import {Server as NetServer, Socket} from "net";
import { NextApiResponse } from "next";
import {Server as SocketIOServer} from "socket.io";
/**
 * Represents a server with members and their profiles.
 */
export type ServerWithMemberWithProfile = Server & {
    /**
     * Represents a member of the server with their profile.
     */
    member: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Server & {
        server: NetServer & {
            io : SocketIOServer;
        };
    }
}
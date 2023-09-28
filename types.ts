import { Member, Profile, Server } from "@prisma/client";

/**
 * Represents a server with members and their profiles.
 */
export type ServerWithMemberWithProfile = Server & {
    /**
     * Represents a member of the server with their profile.
     */
    member: (Member & { profile: Profile })[];
};
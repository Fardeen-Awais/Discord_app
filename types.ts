import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMemberWithProfile = Server & {
    member:(Member & {profile:Profile})[];
};
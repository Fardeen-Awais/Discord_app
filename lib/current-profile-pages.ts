import { getAuth } from "@clerk/nextjs/server";

import { db } from "./db";
import { NextApiRequest } from "next";

export const currentProfilePages = async (req:NextApiRequest) => {
    // Retrieve the user's ID from the authentication context
    const { userId } = getAuth(req);

    // If the user is not authenticated, return null
    if (!userId) {
        return null;
    }

    // Retrieve the user's profile from the database
    const profile = await db.profile.findUnique({
        where: {
            userId,
        },
    });

    // Return the user's profile
    return profile;
};
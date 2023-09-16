import { auth } from "@clerk/nextjs";

import { db } from "./db";

/**
 * Retrieves the current user's profile from the database.
 * @returns {Promise<Object|null>} The user's profile object, or null if the user is not authenticated.
 */
export const currentProfile = async () => {
    // Retrieve the user's ID from the authentication context
    const { userId } = auth();

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
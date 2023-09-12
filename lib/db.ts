import { PrismaClient } from "@prisma/client";

// Declare global variable for Prisma client
declare global {
    var prisma: PrismaClient | undefined;
}

// Initialize and export Prisma client
export const db = globalThis.prisma || new PrismaClient();

// If the NODE_ENV environment variable is not set to "production", globalThis.prisma is assigned the value of db.
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}
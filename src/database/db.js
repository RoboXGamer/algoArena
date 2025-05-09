import { myEnvironment } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (myEnvironment.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

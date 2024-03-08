import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";

import { AuthOptions } from "@/app/utils/auth";

const prisma = new PrismaClient();

const handler = NextAuth(AuthOptions);
export { handler as GET, handler as POST };

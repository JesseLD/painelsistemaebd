import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { userModel } from "@/services/user/user";
import prisma from "./prisma";

export const AuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password || "",
        );
        if (!isValid) {
          return null;
        }

        // if (user.email && user.name) {
        //   userModel.email = user.email;
        //   userModel.name = user.name;
        // }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          password: user.password,
        };
      },
    }),
  ],
  session: {
    maxAge: 3600,
  },
  secret: process.env.NEXTAUTH_SECRET || "jesse",
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
  },
};

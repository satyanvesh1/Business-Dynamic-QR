import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("AUTH DEBUG - MISSING CREDENTIALS");
            return null;
          }

          const email = String(credentials.email).trim();
          const password = String(credentials.password);

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          console.log("AUTH DEBUG - USER FOUND:", !!user);

          if (!user) {
            console.log("AUTH DEBUG - USER NOT FOUND");
            return null;
          }

          console.log("AUTH DEBUG - EMAIL:", user.email);
          console.log("AUTH DEBUG - ROLE:", user.role);
          console.log(
            "AUTH DEBUG - HASH LENGTH:",
            user.passwordHash.length
          );

          const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
          );

          console.log(
            "AUTH DEBUG - PASSWORD MATCH:",
            passwordMatch
          );

          if (!passwordMatch) {
            console.log("AUTH DEBUG - INVALID PASSWORD");
            return null;
          }

          console.log("AUTH DEBUG - LOGIN SUCCESS");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("AUTH DEBUG - AUTHORIZE ERROR:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt" as const,
  },

  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
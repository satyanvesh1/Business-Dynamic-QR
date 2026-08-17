import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
  where: {
    email,
  },
});

console.log("AUTH DEBUG - USER FOUND:", !!user);

if (!user) {
  return null;
}

console.log("AUTH DEBUG - EMAIL:", user.email);
console.log("AUTH DEBUG - ROLE:", user.role);
console.log("AUTH DEBUG - HASH LENGTH:", user.passwordHash.length);

const passwordMatch = await bcrypt.compare(
  password,
  user.passwordHash
);

console.log("AUTH DEBUG - PASSWORD MATCH:", passwordMatch);

if (!passwordMatch) {
  return null;
}

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
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
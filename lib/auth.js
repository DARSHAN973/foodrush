import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  // PrismaAdapter — translates NextAuth's internal database actions
  // (like creating/deleting sessions) into Prisma Client queries.
  adapter: PrismaAdapter(prisma),
  // Database Session Strategy — overrides NextAuth's default JWT behavior.
  // Instead of storing encrypted user data in a cookie, this generates a random
  // sessionToken, saves it in the `Session` database table, and stores only that token in the cookie.
  session: {
    strategy: "database",
  },

  // CredentialsProvider — allows traditional email/password login
  // rather than third-party logins (like Google or GitHub).
  providers: [
    CredentialsProvider({
      name: "credentials",
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
      // authorize — the gatekeeper function that runs when a user submits their login form.
      // NextAuth passes the form inputs here so we can verify the user manually.
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );
        if (!isPasswordCorrect) {
          return null;
        }

        return user;
      },
    }),
  ],
  // NEXTAUTH_SECRET — used to cryptographically sign and encrypt the session cookies
  // so client-side tampering is impossible.
  secret: process.env.NEXTAUTH_SECRET,
};

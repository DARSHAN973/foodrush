import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  // JWT Session Strategy — encrypts user data (id, name, email) directly into
  // a signed cookie. No session rows are written to the database.
  // This is required when using the CredentialsProvider — NextAuth enforces this rule.
  session: {
    strategy: "jwt",
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

  callbacks: {
    // jwt callback — runs when a token is created (login) or read (every request).
    // We copy user.id into the token here because it is only available on first login.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // session callback — runs when session data is requested (e.g. useSession() or getServerSession()).
    // We copy token.id into session.user so every page can access the logged-in user's database id.
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  // NEXTAUTH_SECRET — used to cryptographically sign and encrypt the JWT cookie
  // so client-side tampering is impossible.
  secret: process.env.NEXTAUTH_SECRET,
};

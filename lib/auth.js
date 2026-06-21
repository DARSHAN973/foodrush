import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

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

        // If the user signed up with Google, they have no local password.
        // Prevent bcrypt from crashing and reject the login cleanly.
        if (!user.passwordHash) {
          throw new Error("Please log in with Google.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );
        if (!isPasswordCorrect) {
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // jwt callback — runs when a token is created (login) or read (every request).
    // `account` is only present on the very first sign-in, not on subsequent requests.
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        // Google sign-in — Google gives us a string sub ("108570951376327888017"),
        // NOT a database id. We look up (or auto-create) the User row by email so
        // we can store OUR database integer id in the token instead.
        // This keeps session.user.id consistent with the credentials login path.
        let dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (!dbUser) {
          // First-time Google login — create a User row with no password hash.
          dbUser = await prisma.user.create({
            data: {
              email: token.email,
              name: token.name ?? "Google User",
              // passwordHash is null for OAuth users — they authenticate via Google,
              // so there is no local password to store.
              passwordHash: null,
            },
          });
        }
        token.id = dbUser.id; // always an Int — matches Cart.userId type
        token.role = dbUser.role;
      } else if (user) {
        // Credentials sign-in — user.id is already the database integer id.
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // session callback — runs when session data is requested (e.g. useSession() or getServerSession()).
    // We copy token.id into session.user so every page can access the logged-in user's database id.
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect to /login when authorization fails
  },

  // NEXTAUTH_SECRET — used to cryptographically sign and encrypt the JWT cookie
  // so client-side tampering is impossible.
  secret: process.env.NEXTAUTH_SECRET,
};

// app/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import postgres from "postgres";
import bcrypt from "bcrypt";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return undefined;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string(),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await getUser(email);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  // 🚀 THIS FIXES YOUR LOGIN PROBLEM
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // store user inside JWT
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any; // pass stored user to session
      }
      return session;
    },
  },
});

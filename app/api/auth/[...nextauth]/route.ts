import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import postgres from "postgres";

import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
const handler = NextAuth(authConfig);

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

async function getUser(email: string): Promise<User | undefined> {
  const result = await sql<User[]>`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result[0];
}

const config = {
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],

  callbacks: {
    async session(
      { session, token }: { session: Session; token: JWT }
    ) {
      // Guarantee session.user exists
      session.user ??= {} as any;

      if (token?.id) session.user.id = token.id as string;
      if (token?.email) session.user.email = token.email as string;
      if (token?.name) session.user.name = token.name as string;

      return session;
    },
  },
};

// ⭐ Correct NextAuth export for App Router
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);

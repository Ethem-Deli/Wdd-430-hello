// app/lib/auth.ts
import Credentials from "next-auth/providers/credentials";
import postgres from "postgres";
import bcrypt from "bcrypt";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false }
});

async function getUser(email: string): Promise<User | undefined> {
  const result = await sql<User[]>`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result[0];
}

export const authOptions = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string()
        }).safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    }
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET
};

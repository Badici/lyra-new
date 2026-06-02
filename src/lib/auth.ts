import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/cont/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parolă", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email.toLowerCase(),
            active: true,
          },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!isValid) {
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
  callbacks: {
    jwt({
      token,
      user,
    }: {
      token: Record<string, unknown>;
      user?: {
        id: string;
        role: UserRole;
      };
    }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({
      session,
      token,
    }: {
      session: Session;
      token: Record<string, unknown>;
    }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.role =
          token.role === UserRole.ADMIN || token.role === UserRole.CUSTOMER
            ? token.role
            : UserRole.CUSTOMER;
      }
      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}

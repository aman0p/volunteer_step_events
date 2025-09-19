import NextAuth, { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { Role } from "@/generated/prisma";

export const authOptions: NextAuthOptions = {
   session: {
      strategy: "jwt" as const,
      maxAge: 60 * 60 * 24, // 24 hours instead of 15 minutes
      updateAge: 60 * 60 * 12, // 12 hours instead of 5 minutes
   },
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(
            credentials: Record<"email" | "password", string> | undefined
         ) {
            if (!credentials?.email || !credentials?.password) {
               throw new Error("Missing email or password");
            }

            const user = await prisma.user.findUnique({
               where: {
                  email: credentials.email,
               },
            });

            if (!user) {
               throw new Error("User not found");
            }

            const isPasswordValid = await compare(
               credentials.password,
               user.password
            );

            if (!isPasswordValid) {
               throw new Error("Invalid password");
            }

            return {
               id: user.id,
               email: user.email,
               name: user.fullName,
               role: user.role,
            };
         },
      }),
   ],
   pages: {
      signIn: "/sign-in",
   },
   callbacks: {
      async jwt({
         token,
         user,
      }: {
         token: JWT;
         user?: { id: string; email: string; name: string; role: Role };
      }) {
         if (user) {
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.role = user.role as Role;
            token.lastFetch = Date.now();
         } else {
            // Only fetch from database if token is older than 1 hour
            const lastFetch = token.lastFetch || 0;
            const oneHour = 60 * 60 * 1000;

            if (token.id && Date.now() - (lastFetch as number) > oneHour) {
               try {
                  const dbUser = await prisma.user.findUnique({
                     where: { id: token.id as string },
                     select: { role: true, fullName: true },
                  });
                  if (dbUser) {
                     token.role = dbUser.role as Role;
                     token.name = dbUser.fullName;
                     token.lastFetch = Date.now();
                  }
               } catch (error) {
                  console.error(
                     "Error fetching user data in JWT callback:",
                     error
                  );
               }
            }
         }
         return token;
      },
      async session({ session, token }: { session: Session; token: JWT }) {
         if (session.user) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            session.user.role = token.role as Role;
         }
         return session;
      },
   },
};

export default NextAuth(authOptions);

import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "./prisma";
import { AuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter({ prisma }),
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password", placeholder: "" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }
        const { email } = credentials;
        try {
          const existingUser = await prisma.userTable.findUnique({
            where: { email },
          });
          if (!existingUser || !existingUser.password) {
            console.log("User not found or no password");
            return null;
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (!isValid) {
            console.log("Invalid password");
            return null;
          }
          return {
            id: existingUser.userID.toString(),
            email: existingUser.email,
            name: existingUser.userName || existingUser.email,
            role: "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username ?? "";
        token.role = user.role ?? "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username ?? undefined;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
};

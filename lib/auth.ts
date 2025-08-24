import { PrismaAdapter } from "@auth/prisma-adapter";

import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "./prisma";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter({ prisma }),
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
        if (!credentials?.email) return null;
        const { email, password } = credentials;

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prisma.userTable.findUnique({
          where: { email },
        });

        if (existingUser) {
          console.log("User found", existingUser);
          try {
            const isValid = await bcrypt.compare(
              hashedPassword,
              existingUser.password
            );
            if (!isValid) return null;
          } catch (error) {
            console.log(error);
            return null;
          }
        }
        if (!existingUser) {
          try {
            console.log("Creating user");
            const user = await prisma.userTable.create({
              data: {
                email,
                password: hashedPassword,
                providerID: "1",
                isPaid: false,
                isActive: true,
                isDelete: false,
                userName: "User",
                createdAt: new Date(),
              },
            });
            console.log("User created", user);
            return {
              id: user.userID,
              email: user.email,
            };
          } catch (error) {
            console.log(error);
            return null;
          }
        }
        return {
          id: existingUser.userID,
          email: existingUser.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",

  callbacks: {
    async session({ session, token }: any) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
    },
  },
};

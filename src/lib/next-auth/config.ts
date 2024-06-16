import { NextAuthConfig } from "next-auth";
import google from "next-auth/providers/google";

export const auth_Config = {
  pages: {
    signIn: '/auth/sign-in'
  },
  providers: [google],
  callbacks: {
    session({ token, session }) {
      if (!token.sub) return session

      session.user.id = token.sub

      return session
    }
  },
  trustHost: true
} satisfies NextAuthConfig
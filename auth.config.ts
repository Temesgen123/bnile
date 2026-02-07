/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request }: any) {
      const protectedPaths = [
        /\/checkout(\/.*)?/,
        /\/account(\/.*)?/,
        /\/admin(\/.*)?/,
      ];
      const { pathname } = request.nextUrl;
      const isProtected = protectedPaths.some((regex) => regex.test(pathname));
      if (isProtected) {
        return !!auth?.user;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

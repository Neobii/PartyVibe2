import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Required for local dev (localhost) and most preview URLs.
  // Alternatively set env AUTH_TRUST_HOST=true.
  trustHost: true,
  providers: [GitHub],
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = nextUrl.pathname.startsWith("/admin");
      if (isAdmin && !auth) return false;
      return true;
    },
  },
});

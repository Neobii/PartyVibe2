import { auth } from "@/auth";

export default auth((req) => {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  if (isAdmin && !req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }
  return undefined;
});

export const config = {
  matcher: ["/admin/:path*"],
};

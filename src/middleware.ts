// This file exports a middleware function from next-auth.
// It will automatically protect routes specified in the `config` object.
// Unauthenticated users trying to access these routes will be redirected to the login page.

export { default } from "next-auth/middleware";

export const config = {
  // The :path* selector ensures that all sub-routes are also protected.
  matcher: ["/client/:path*", "/admin/:path*"],
};

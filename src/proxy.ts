import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy() {
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "ADMIN",
    },
  }
);

export const config = { matcher: ["/admin/:path*"] };

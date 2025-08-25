import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add your middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // Add routes that require authentication
    "/admin/:path*",
    // Exclude auth routes and root route
    "/((?!sign-in|sign-up|api|_next/static|_next/image|favicon.ico|$).*)",
  ]
}
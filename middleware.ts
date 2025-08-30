import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Get the referer header to find the last route the user was on
    const referer = req.headers.get('referer')
    
    if (referer) {
      try {
        // Parse the referer URL to get the path
        const refererUrl = new URL(referer)
        const refererPath = refererUrl.pathname
        
        // If the referer is from the same origin and not the root route, redirect back to it
        if (refererUrl.origin === req.nextUrl.origin && refererPath !== '/') {
          return NextResponse.redirect(new URL(refererPath, req.url))
        }
      } catch (error) {
        // If parsing fails, fall back to root route
        console.error('Error parsing referer:', error)
      }
    }
    
    // Fallback: redirect to root route if no valid referer
    return NextResponse.redirect(new URL("/", req.url))
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // Catch all routes and redirect them to the last valid route or "/"
    "/((?!api|_next/static|_next/image|favicon.ico|$).*)",
  ]
}
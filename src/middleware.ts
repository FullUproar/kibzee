import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth",
  "/terms",
  "/privacy",
  "/events",      // Event browsing is public
  "/venues",      // Venue pages are public
  "/artists",     // Artist pages are public
  "/about",       // About page
]

// Routes that require curator role (FOUNDER_CURATOR or COMMUNITY_CURATOR)
// const curatorRoutes = [
//   "/curator",
// ]

// Routes that require admin role
// const adminRoutes = [
//   "/admin",
// ]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for auth cookie (NextAuth v5 uses sessionToken)
  const sessionToken = request.cookies.get("authjs.session-token") ||
                       request.cookies.get("__Secure-authjs.session-token")

  // Redirect to login if no session
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For now, allow authenticated users to access protected routes
  // TODO: Add role-based access control for curator and admin routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}

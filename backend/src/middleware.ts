import { NextResponse } from "next/server"
import { auth } from "./auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = nextUrl.pathname.startsWith("/login")

  if (isApiAuthRoute) return NextResponse.next()
  
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", nextUrl))
    }
    return NextResponse.next()
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    
    // Check role for admin routes
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl)) // Redirect non-admins away
    }
  }

  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

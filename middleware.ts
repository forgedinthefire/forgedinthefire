import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  
  const { pathname } = request.nextUrl
  
  // Check if Supabase env vars are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // If Supabase is not configured, allow access to login page but block admin
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured - auth features disabled')
    
    // Allow login page to show "not configured" message
    if (pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — MUST call getUser() per Supabase SSR docs
  const { data: { user } } = await supabase.auth.getUser()

  // Protect all /admin/* routes - requires both authentication AND admin role
  if (pathname.startsWith('/admin')) {
    // First check if user is authenticated
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    
    // Then check if user is in admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('email', user.email)
      .single()
    
    // If not an admin, redirect to unauthorized page
    if (adminError || !adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'owner')) {
      console.warn(`Non-admin user attempted access: ${user.email}`)
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  // If already logged in and is admin, redirect /login → /admin
  if (pathname === '/login' && user) {
    // Check if user is an admin before redirecting
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('email', user.email)
      .single()
    
    if (adminUser && (adminUser.role === 'admin' || adminUser.role === 'owner')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    // If not an admin, let them stay on login page to see error
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/unauthorized',
  ],
}

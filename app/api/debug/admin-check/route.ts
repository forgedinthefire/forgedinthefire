import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const debug: any = { 
    timestamp: new Date().toISOString(),
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  }
  
  try {
    const supabase = await createClient()
    debug.hasClient = !!supabase
    
    if (!supabase) {
      return NextResponse.json({ error: 'No supabase client', debug }, { status: 503 })
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    debug.hasUser = !!user
    debug.userError = userError?.message
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated', debug }, { status: 401 })
    }
    
    debug.userEmail = user.email
    
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
    
    debug.adminUser = adminUser
    debug.adminError = adminError?.message
    debug.isAdmin = adminUser?.role === 'admin' || adminUser?.role === 'owner'
    
    // Also get all admin users to verify table
    const { data: allAdmins, error: allAdminsError } = await supabase
      .from('admin_users')
      .select('email, role')
    
    debug.allAdmins = allAdmins
    debug.allAdminsError = allAdminsError?.message
    
    return NextResponse.json({
      authenticated: !!user,
      isAdmin: debug.isAdmin,
      user: user.email,
      adminUser,
      debug
    })
  } catch (error: any) {
    debug.catchError = error.message
    return NextResponse.json({ error: 'Exception', debug }, { status: 500 })
  }
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  PenSquare,
  Megaphone,
  Mail,
  Star,
  Settings,
  LogOut,
  Briefcase,
  Search,
  Share2,
  Zap,
  Wrench,
  Calendar,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Blog Studio', href: '/admin/blog-studio', icon: PenSquare },
  { label: 'Social Publisher', href: '/admin/social', icon: Share2 },
  { label: 'Promotions', href: '/admin/promotions', icon: Megaphone },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Service Requests', href: '/admin/service-requests', icon: Wrench },
  { label: 'Part Reservations', href: '/admin/part-reservations', icon: Calendar },
  { label: 'Pixel & Tracking', href: '/admin/pixel', icon: Zap },
  { label: 'Subscribers', href: '/admin/subscribers', icon: Mail },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'SEO Center', href: '/admin/seo', icon: Search },
  { label: 'Careers', href: '/admin/careers', icon: Briefcase },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f4f6f9' }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 text-white flex flex-col" style={{ backgroundColor: '#081d3a' }}>
        <div className="px-5 py-5 border-b border-white/10">
          <p className="font-bold text-base" style={{ color: '#c9a84c' }}>Thomas Marine</p>
          <p className="text-xs text-gray-400">Admin Portal</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-2 py-4 border-t border-white/10">
          <p className="text-xs text-gray-500 px-3 mb-2 truncate" title={user.email ?? ''}>
            {user.email}
          </p>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors w-full"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

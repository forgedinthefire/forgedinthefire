export const dynamic = 'force-dynamic'

export default function SimpleAdminPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-[#1E1714] mb-2">Simple Admin Dashboard</h1>
      <p className="text-[#8B5E3C]">This page doesn't fetch any data.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/admin/content" className="bg-white rounded-2xl p-5 border border-[#3A2A24]/20 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] mb-2">Content</p>
          <p className="text-lg font-bold text-[#1E1714]">Manage Content</p>
        </a>
        <a href="/admin/blog" className="bg-white rounded-2xl p-5 border border-[#3A2A24]/20 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] mb-2">Blog</p>
          <p className="text-lg font-bold text-[#1E1714]">Blog Studio</p>
        </a>
        <a href="/admin/careers" className="bg-white rounded-2xl p-5 border border-[#3A2A24]/20 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] mb-2">Careers</p>
          <p className="text-lg font-bold text-[#1E1714]">Job Positions</p>
        </a>
      </div>
    </div>
  )
}

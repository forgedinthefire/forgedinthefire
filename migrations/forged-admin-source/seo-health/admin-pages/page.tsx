import type { Metadata } from 'next'
import { readFile } from 'fs/promises'
import { join } from 'path'
import SEOAuditPanel from './SEOAuditPanel'

export const metadata: Metadata = { title: 'SEO Control Center | Admin' }

async function getSEOAuditData() {
  try {
    const reportPath = join(process.cwd(), 'generated', 'seo-audit-report.json')
    const data = await readFile(reportPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

export default async function SEOAdminPage() {
  const auditData = await getSEOAuditData()

  return (
    <div className="p-8 max-w-screen-2xl">
      <SEOAuditPanel auditData={auditData} />
    </div>
  )
}

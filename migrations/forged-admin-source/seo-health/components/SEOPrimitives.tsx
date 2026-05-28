import type { SEOHealthStatus, SEOIssue } from '../seoTypes'
import { CATEGORY_LABELS } from '../seoTypes'

// ── Health light ──────────────────────────────────────────────────────────────
export function HealthLight({ status, size = 'md' }: { status: SEOHealthStatus; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  const color = status === 'green' ? 'bg-emerald-500' : status === 'yellow' ? 'bg-amber-400' : 'bg-red-500'
  const ring = status === 'green' ? 'ring-emerald-200' : status === 'yellow' ? 'ring-amber-200' : 'ring-red-200'
  return <span className={`inline-block rounded-full ring-2 ${dim} ${color} ${ring} shrink-0`} />
}

// ── Score badge ───────────────────────────────────────────────────────────────
export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : score >= 70 ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-red-700 bg-red-50 border-red-200'
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {score}
    </span>
  )
}

// ── Section heading ───────────────────────────────────────────────────────────
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 mt-6 first:mt-0">{children}</h3>
}

// ── Field row ─────────────────────────────────────────────────────────────────
export function FieldRow({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function SEOInput({ value, onChange, placeholder, maxLength, mono }: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; mono?: boolean
}) {
  return (
    <div>
      <input
        className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${mono ? 'font-mono' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {maxLength && (
        <p className={`text-xs mt-0.5 text-right ${value.length > maxLength * 0.95 ? 'text-amber-600' : 'text-gray-400'}`}>
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function SEOTextarea({ value, onChange, placeholder, maxLength, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; rows?: number
}) {
  return (
    <div>
      <textarea
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {maxLength && (
        <p className={`text-xs mt-0.5 text-right ${value.length > maxLength * 0.95 ? 'text-amber-600' : 'text-gray-400'}`}>
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function SEOToggle({ label, checked, onChange, description }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5 shrink-0">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`} />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </label>
  )
}

// ── Issue card ────────────────────────────────────────────────────────────────
export function IssueCard({ issue, onAutoFix }: { issue: SEOIssue; onAutoFix?: (id: string) => void }) {
  const border = issue.severity === 'red' ? 'border-red-200 bg-red-50' : issue.severity === 'yellow' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'
  const badge = issue.severity === 'red' ? 'bg-red-100 text-red-700' : issue.severity === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
  return (
    <div className={`border rounded-xl p-3.5 ${border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <HealthLight status={issue.severity} size="sm" />
          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className="text-sm font-semibold text-gray-900">{issue.title}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${badge}`}>{CATEGORY_LABELS[issue.category]}</span>
            </div>
            <p className="text-xs text-gray-600">{issue.description}</p>
            {issue.suggestedFix && <p className="text-xs text-blue-700 mt-1 italic">→ {issue.suggestedFix}</p>}
          </div>
        </div>
        {issue.fixType === 'auto_fix' && onAutoFix && (
          <button
            onClick={() => onAutoFix(issue.id)}
            className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#0a2d7a)' }}
          >
            Auto-Fix
          </button>
        )}
        {issue.fixType === 'developer_needed' && (
          <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-lg bg-gray-100 text-gray-500">Dev needed</span>
        )}
      </div>
    </div>
  )
}

// ── Action button ─────────────────────────────────────────────────────────────
export function ActionButton({ onClick, children, variant = 'secondary', disabled }: {
  onClick: () => void; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean
}) {
  const styles = variant === 'primary'
    ? 'text-white hover:scale-105'
    : variant === 'danger'
    ? 'border border-red-200 text-red-600 bg-white hover:bg-red-50'
    : 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50 ${styles}`}
      style={variant === 'primary' ? { background: 'linear-gradient(135deg,#1d4ed8,#0a2d7a)' } : {}}
    >
      {children}
    </button>
  )
}

// ── Check row ─────────────────────────────────────────────────────────────────
export function CheckRow({ label, pass, warn }: { label: string; pass: boolean; warn?: boolean }) {
  const icon = pass ? '✓' : warn ? '⚠' : '✕'
  const color = pass ? 'text-emerald-600' : warn ? 'text-amber-500' : 'text-red-500'
  return (
    <div className="flex items-center gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
      <span className={`text-sm font-bold w-4 ${color}`}>{icon}</span>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  )
}

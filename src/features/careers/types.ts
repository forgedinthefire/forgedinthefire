// Careers Types for Forged in the Fire
// Job positions and application types

// ─────────────────────────────────────────────────────────────────────────────
// JOB POSITION MODEL
// ─────────────────────────────────────────────────────────────────────────────

export type JobPosition = {
  id: string
  title: string
  slug: string
  type: string
  description: string
  duties?: string
  requirements?: string
  pay_range?: string
  location: string
  active: boolean
  sort_order: number
  created_at: string
  updated_at?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYMENT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type EmploymentType = 
  | 'Full-Time'
  | 'Part-Time'
  | 'Contract'
  | 'Volunteer'
  | 'Internship'

export const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: 'Full-Time', label: 'Full-Time' },
  { value: 'Part-Time', label: 'Part-Time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Internship', label: 'Internship' },
]

export function getEmploymentTypeLabel(type: string): string {
  const option = EMPLOYMENT_TYPE_OPTIONS.find(opt => opt.value === type)
  return option?.label || type
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type GetJobPositionsResponse = {
  positions: JobPosition[]
  count: number
}

export type JobPositionDetailResponse = {
  position: JobPosition | null
  error?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type CreateJobPositionInput = {
  title: string
  slug?: string
  type?: string
  description: string
  duties?: string
  requirements?: string
  pay_range?: string
  location?: string
  active?: boolean
  sort_order?: number
}

export type UpdateJobPositionInput = CreateJobPositionInput & {
  id: string
}

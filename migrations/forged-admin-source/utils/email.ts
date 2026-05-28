import { Resend } from 'resend'

const TO = 'info@thomasmarinellc.com'
const FROM = 'Thomas Marine Website <noreply@thomasmarinellc.com>'

export type ContactEmailData = {
  name: string
  email?: string | null
  phone?: string | null
  preferred_contact?: string | null
  type: string
  message: string
  position?: string | null
}

export type FinancingEmailData = {
  first_name: string
  last_name: string
  email: string
  phone: string
  boat_year?: string | null
  boat_make?: string | null
  boat_model?: string | null
  purchase_price?: string | null
  down_payment?: string | null
  preferred_term?: string | null
  employer?: string | null
  gross_monthly_income?: string | null
}

function row(label: string, value: string | null | undefined) {
  if (!value) return ''
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:13px;white-space:nowrap">${label}</td><td style="padding:4px 0;font-size:13px;color:#111">${value}</td></tr>`
}

export async function sendContactEmail(data: ContactEmailData) {
  const typeLabel: Record<string, string> = {
    general: 'General Inquiry',
    service: 'Service Request',
    'job-application': 'Job Application',
    sales: 'Sales Inquiry',
  }

  const subject = data.type === 'job-application'
    ? `Job Application — ${data.position ?? 'General Interest'}`
    : `New ${typeLabel[data.type] ?? 'Inquiry'} from ${data.name}`

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0d2b55;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">${subject}</h1>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">Submitted via thomasmarinellc.com</p>
      </div>
      <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <table style="border-collapse:collapse;width:100%">
          ${row('Name', data.name)}
          ${row('Email', data.email)}
          ${row('Phone', data.phone)}
          ${row('Preferred Contact', data.preferred_contact)}
          ${data.type === 'job-application' ? row('Position', data.position ?? 'General Interest') : ''}
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
        <p style="font-size:13px;color:#6b7280;margin:0 0 8px">Message</p>
        <p style="font-size:14px;color:#111;margin:0;white-space:pre-wrap">${data.message}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
        <a href="mailto:${data.email ?? ''}" style="display:inline-block;background:#0d2b55;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600">Reply to ${data.name}</a>
      </div>
    </div>
  `

  const resend = new Resend(process.env.RESEND_API_KEY)
  return resend.emails.send({ from: FROM, to: TO, subject, html, replyTo: data.email ?? undefined })
}

export type SubscriberEmailData = {
  email: string
  source: string
}

export async function sendSubscriberEmail(data: SubscriberEmailData) {
  const subject = `New Newsletter Subscriber — ${data.email}`
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0d2b55;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:18px">New Newsletter Subscriber</h1>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">Submitted via thomasmarinellc.com</p>
      </div>
      <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <table style="border-collapse:collapse;width:100%">
          ${row('Email', data.email)}
          ${row('Source', data.source)}
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
        <p style="font-size:13px;color:#6b7280;margin:0">This subscriber has been saved to your admin portal under <strong>Subscribers</strong>.</p>
        <a href="https://thomas-marine-preview.netlify.app/admin/subscribers" style="display:inline-block;margin-top:12px;background:#0d2b55;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600">View All Subscribers</a>
      </div>
    </div>
  `
  const resend = new Resend(process.env.RESEND_API_KEY)
  return resend.emails.send({ from: FROM, to: TO, subject, html })
}

export async function sendFinancingEmail(data: FinancingEmailData) {
  const name = `${data.first_name} ${data.last_name}`
  const subject = `Financing Application — ${name}`

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0d2b55;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">${subject}</h1>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">Submitted via thomasmarinellc.com/financing</p>
      </div>
      <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <p style="font-size:13px;font-weight:700;color:#0d2b55;margin:0 0 12px;text-transform:uppercase;letter-spacing:.05em">Applicant</p>
        <table style="border-collapse:collapse;width:100%">
          ${row('Name', name)}
          ${row('Email', data.email)}
          ${row('Phone', data.phone)}
          ${row('Employer', data.employer)}
          ${row('Monthly Income', data.gross_monthly_income ? `$${data.gross_monthly_income}` : null)}
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
        <p style="font-size:13px;font-weight:700;color:#0d2b55;margin:0 0 12px;text-transform:uppercase;letter-spacing:.05em">Requested Boat</p>
        <table style="border-collapse:collapse;width:100%">
          ${row('Year', data.boat_year)}
          ${row('Make', data.boat_make)}
          ${row('Model', data.boat_model)}
          ${row('Purchase Price', data.purchase_price ? `$${data.purchase_price}` : null)}
          ${row('Down Payment', data.down_payment ? `$${data.down_payment}` : null)}
          ${row('Preferred Term', data.preferred_term)}
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
        <a href="mailto:${data.email}" style="display:inline-block;background:#0d2b55;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600">Reply to ${name}</a>
      </div>
    </div>
  `

  const resend = new Resend(process.env.RESEND_API_KEY)
  return resend.emails.send({ from: FROM, to: TO, subject, html, replyTo: data.email })
}

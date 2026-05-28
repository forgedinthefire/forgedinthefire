'use client'
import { nanoid } from 'nanoid'
import type { BlogBlock } from './types'

export type StudioTemplate = {
  id: string
  label: string
  description: string
  icon: string
  blocks: () => BlogBlock[]
}

function heading(text: string, level: 2 | 3 = 2, eyebrow?: string): BlogBlock {
  return { id: nanoid(), type: 'heading', enabled: true, internalLabel: 'Heading', data: { text, level, align: 'left', eyebrow } }
}
function paragraph(body: string): BlogBlock {
  return { id: nanoid(), type: 'paragraph', enabled: true, internalLabel: 'Text Section', data: { body, size: 'base', align: 'left' } }
}
function divider(style: 'line' | 'wave' | 'dots' | 'space' = 'line'): BlogBlock {
  return { id: nanoid(), type: 'divider', enabled: true, internalLabel: 'Divider', data: { style } }
}
function cta(title: string): BlogBlock {
  return { id: nanoid(), type: 'cta', enabled: true, internalLabel: 'Call To Action', data: { title, text: 'Our certified team is ready to help.', primaryButtonText: 'Schedule Service', primaryButtonUrl: '/contact', style: 'service' } }
}
function buttonCta(label: string, url = '/contact'): BlogBlock {
  return { id: nanoid(), type: 'button_cta', enabled: true, internalLabel: 'Button', data: { label, url, style: 'primary', align: 'center', subtext: 'Georgetown, SC — (843) 833-8054' } }
}

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    id: 'standard_blog',
    label: 'Standard Blog Post',
    description: 'A clean article with intro, main content, and a service CTA.',
    icon: '📝',
    blocks: () => [
      heading('Your Post Title Here'),
      paragraph('Write your introduction here. Tell readers what this post is about and why it matters to them as a boat owner.'),
      divider('wave'),
      heading('Main Section Heading', 2),
      paragraph('Add your main content here. Break it into multiple text sections as needed.'),
      divider('dots'),
      { id: nanoid(), type: 'quote', enabled: true, internalLabel: 'Customer Quote', data: { quote: 'Add a customer testimonial or key takeaway here.', attribution: 'Happy Customer', role: 'Georgetown, SC' } } as BlogBlock,
      divider('line'),
      cta('Ready to Schedule Service?'),
    ],
  },
  {
    id: 'service_explainer',
    label: 'Service Explainer',
    description: 'Walk customers through a service with steps and FAQs.',
    icon: '🔧',
    blocks: () => [
      heading('What Is [Service Name] and Why Does It Matter?'),
      paragraph('Explain the service in simple terms. Who needs it? When should it be done?'),
      divider('wave'),
      { id: nanoid(), type: 'quick_answer', enabled: true, internalLabel: 'Quick Answer', data: { title: 'What is the short answer?', answer: 'Summarize the service benefit in 1–2 sentences here.' } } as BlogBlock,
      heading('How the Service Works', 2),
      { id: nanoid(), type: 'service_steps', enabled: true, internalLabel: 'Service Steps', data: { heading: 'Our Process', steps: [ { id: nanoid(), stepNumber: 1, title: 'Inspection', description: 'We inspect your boat\'s system before beginning work.' }, { id: nanoid(), stepNumber: 2, title: 'Service', description: 'Our certified technicians perform the service.' }, { id: nanoid(), stepNumber: 3, title: 'Quality Check', description: 'We verify everything is working correctly.' }, ] } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'faq', enabled: true, internalLabel: 'FAQ', data: { heading: 'Common Questions', items: [ { id: nanoid(), question: 'How often should this be done?', answer: 'Enter the recommended frequency here.' }, { id: nanoid(), question: 'How much does it cost?', answer: 'Contact us for a free estimate.' }, ] } } as BlogBlock,
      buttonCta('Get a Free Estimate'),
    ],
  },
  {
    id: 'maintenance_checklist',
    label: 'Maintenance Checklist',
    description: 'A practical checklist post with numbered steps.',
    icon: '✅',
    blocks: () => [
      heading('Your Complete [Topic] Checklist'),
      paragraph('Use this checklist to make sure you cover every step. A few minutes of preparation can save hours of trouble on the water.'),
      divider('line'),
      { id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Checklist', data: { heading: 'What to Check', intro: 'Go through each item before heading out.', items: [ { id: nanoid(), text: 'Check engine oil level', note: 'Replace if dark or low.' }, { id: nanoid(), text: 'Inspect fuel lines for cracks', note: 'Replace any cracked lines immediately.' }, { id: nanoid(), text: 'Test navigation lights', note: 'Required by law after sunset.' }, { id: nanoid(), text: 'Check battery charge level', note: 'Should read 12.6V or higher.' }, { id: nanoid(), text: 'Inspect propeller for damage', note: 'Any dings affect performance.' }, ] } } as BlogBlock,
      divider('dots'),
      paragraph('If any of these items need attention, bring your boat in before your next trip. Catching issues early is always less expensive than repairs.'),
      cta('Schedule a Pre-Season Inspection'),
    ],
  },
  {
    id: 'before_after',
    label: 'Before & After Project',
    description: 'Showcase a restoration or repair project with before/after photos.',
    icon: '🔄',
    blocks: () => [
      heading('Project Spotlight: [Describe the Job]'),
      paragraph('Describe the project. Who brought the boat in? What was the issue? What were the goals?'),
      divider('wave'),
      { id: nanoid(), type: 'before_after', enabled: true, internalLabel: 'Before & After', data: { heading: 'The Transformation', beforeImage: { id: '', url: '', alt: 'Before' }, afterImage: { id: '', url: '', alt: 'After' }, beforeLabel: 'Before', afterLabel: 'After', description: 'Describe the key difference the work made.' } } as BlogBlock,
      divider('dots'),
      heading('What We Did', 2),
      { id: nanoid(), type: 'service_steps', enabled: true, internalLabel: 'Steps', data: { heading: 'The Process', steps: [ { id: nanoid(), stepNumber: 1, title: 'Assessment', description: 'We evaluated the full scope of work needed.' }, { id: nanoid(), stepNumber: 2, title: 'Repair Work', description: 'Our technicians completed the work to factory spec.' }, { id: nanoid(), stepNumber: 3, title: 'Final Detail', description: 'We finished with a thorough clean and quality inspection.' }, ] } } as BlogBlock,
      cta('Have a Similar Project?'),
    ],
  },
  {
    id: 'video_post',
    label: 'Video Post',
    description: 'Center a post around a YouTube or Vimeo video.',
    icon: '▶️',
    blocks: () => [
      heading('Watch: [Video Title]'),
      paragraph('Add a short intro before the video. What will viewers learn? Why should they watch?'),
      { id: nanoid(), type: 'youtube_video', enabled: true, internalLabel: 'Main Video', data: { url: '', heading: '', caption: 'Video from Thomas Marine LLC' } } as BlogBlock,
      divider('line'),
      heading('Key Takeaways', 2),
      { id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Key Takeaways', data: { heading: 'What You Learned', intro: '', items: [ { id: nanoid(), text: 'Add a key point from the video here.' }, { id: nanoid(), text: 'Add another takeaway.' }, ] } } as BlogBlock,
      cta('Questions? We Are Here to Help.'),
    ],
  },
  {
    id: 'faq_article',
    label: 'FAQ Article',
    description: 'Answer common customer questions in one place.',
    icon: '❓',
    blocks: () => [
      heading('Everything You Need to Know About [Topic]'),
      paragraph('This guide answers the most common questions we hear from boat owners in Georgetown, SC. Bookmark it as a reference.'),
      divider('wave'),
      { id: nanoid(), type: 'faq', enabled: true, internalLabel: 'FAQ Section', data: { heading: 'Frequently Asked Questions', items: [ { id: nanoid(), question: 'What is the first question?', answer: 'Write a clear, direct answer here.' }, { id: nanoid(), question: 'What is the second question?', answer: 'Write a clear, direct answer here.' }, { id: nanoid(), question: 'What is the third question?', answer: 'Write a clear, direct answer here.' }, { id: nanoid(), question: 'How do I schedule service?', answer: 'Call us at (843) 833-8054 or fill out our contact form online.' }, ] } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'service_callout', enabled: true, internalLabel: 'Service Callout', data: { heading: 'Still Have Questions?', description: 'Our team at Thomas Marine is always happy to help. Stop by or call us.', services: [ { id: nanoid(), name: 'Call Us', description: '(843) 833-8054', url: 'tel:8438338054' }, { id: nanoid(), name: 'Visit Us', description: '1199 David W Ray Road, Georgetown, SC', url: '/contact' }, ] } } as BlogBlock,
    ],
  },
  {
    id: 'seasonal_reminder',
    label: 'Seasonal Service Reminder',
    description: 'Timely service reminders for spring/fall/winter.',
    icon: '🌊',
    blocks: () => [
      heading('It\'s Time for Your [Season] Boat Service'),
      paragraph('Seasonal service keeps your boat running reliably and protects your investment. Here\'s what to schedule now and why it matters.'),
      divider('wave'),
      { id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Seasonal Checklist', data: { heading: 'This Season\'s Service List', intro: 'These are the most important items for this time of year.', items: [ { id: nanoid(), text: 'Engine oil and filter change' }, { id: nanoid(), text: 'Gear oil change (lower unit)' }, { id: nanoid(), text: 'Fuel system inspection' }, { id: nanoid(), text: 'Cooling system flush and inspect' }, { id: nanoid(), text: 'Battery test and terminal clean' }, ] } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'quick_answer', enabled: true, internalLabel: 'Why Now?', data: { title: 'Why does timing matter?', answer: 'Scheduling early means you beat the rush and your boat is ready when the season starts. Most service issues found during seasonal inspections are minor — until they are not.' } } as BlogBlock,
      cta('Book Your Seasonal Service Now'),
    ],
  },
  {
    id: 'inventory_spotlight',
    label: 'Boat or Inventory Spotlight',
    description: 'Showcase a specific boat or product in detail.',
    icon: '🛥️',
    blocks: () => [
      heading('Spotlight: [Year Make Model]'),
      paragraph('Describe the boat or product. Key features, condition, and what makes it stand out. Who is this a great fit for?'),
      divider('wave'),
      { id: nanoid(), type: 'specs_table', enabled: true, internalLabel: 'Specs', data: { heading: 'Key Specifications', specs: [ { id: nanoid(), label: 'Year', value: '' }, { id: nanoid(), label: 'Length', value: '' }, { id: nanoid(), label: 'Engine', value: '' }, { id: nanoid(), label: 'Hours', value: '' }, { id: nanoid(), label: 'Asking Price', value: '' }, ] } } as BlogBlock,
      divider('dots'),
      heading('Why We Like This One', 2),
      paragraph('Add your team\'s perspective. What makes this particular boat or product worth considering?'),
      { id: nanoid(), type: 'trust_badges', enabled: true, internalLabel: 'Trust Badges', data: { badges: [ { id: nanoid(), label: 'Inspected by Our Team' }, { id: nanoid(), label: 'Certified Suzuki Dealer' }, { id: nanoid(), label: 'Georgetown, SC' }, ] } } as BlogBlock,
      cta('Interested? Contact Our Team Today'),
    ],
  },
]

type Props = {
  onSelect: (blocks: BlogBlock[]) => void
  onClose: () => void
}

export default function BlogTemplatePicker({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(4,14,33,0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #040e21, #0d2b55)' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Choose a Starter Template</h2>
            <p className="text-xs text-blue-200 mt-0.5">Pick one to pre-fill your post with the right sections. You can change everything after.</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Template grid */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STUDIO_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => { onSelect(t.blocks()); onClose() }}
                className="group text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-[#0d2b55] bg-white hover:bg-[#0d2b55]/5 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-bold text-sm text-gray-900 group-hover:text-[#0d2b55]">{t.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button onClick={() => { onSelect([]); onClose() }} className="text-xs text-gray-400 hover:text-gray-600 underline">
              Start with a blank post instead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

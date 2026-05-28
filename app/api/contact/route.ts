import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
  isSurvivor: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // Save to Supabase
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: validated.name || null,
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone || null,
        subject: validated.subject || 'General Inquiry',
        message: validated.message,
        is_survivor: validated.isSurvivor,
        status: 'new',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Contact form save error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message received' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

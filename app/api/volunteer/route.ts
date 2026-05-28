import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const volunteerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string(),
  message: z.string().min(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = volunteerSchema.parse(body);

    // Save to Supabase
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from('volunteer_applications')
      .insert({
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone || null,
        role: validated.role,
        message: validated.message,
        status: 'new',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Volunteer application save error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save application' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Application received' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Volunteer form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process application' },
      { status: 500 }
    );
  }
}

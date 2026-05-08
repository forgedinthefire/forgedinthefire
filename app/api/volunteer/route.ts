import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

    // Here you would integrate with your email service
    console.log('Volunteer application:', validated);

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

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

    // Here you would integrate with Resend or another email service
    // Example:
    // await resend.emails.send({
    //   from: 'contact@forgedinthefire.org',
    //   to: 'help@forgedinthefire.org',
    //   subject: validated.isSurvivor ? '[SURVIVOR] New Contact Form' : 'New Contact Form',
    //   text: validated.message,
    //   reply_to: validated.email,
    // });

    // For now, just log and return success
    console.log('Contact form submission:', validated);

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

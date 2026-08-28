import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role for admin insert
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to Supabase (optional, but good for records)
    // We use the service role key so we don't need anonymous RLS enabled
    const { error: dbError } = await supabaseAdmin
      .from('contact_messages')
      .insert([{ name, email, message }]);

    if (dbError) {
      console.error('Failed to save contact message to DB:', dbError);
      // We can continue even if DB fails, as long as we try to send the email
    }

    // 2. Send email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Contact Form <onboarding@resend.dev>', // Update to a verified domain in production
          to: 'hello@paymentreminders.app', // Where you want to receive the emails
          reply_to: email,
          subject: `New Contact Form Submission from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.text();
        console.error('Failed to send email via Resend:', errData);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
    } else {
      console.warn('RESEND_API_KEY is not set. Skipping email delivery.');
      // If no key is set, we still return success if the DB insert worked, 
      // but warn in the logs.
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

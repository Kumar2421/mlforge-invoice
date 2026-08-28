import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { email, organizationId, reason } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('email_unsubscribes')
      .insert([
        {
          email,
          organization_id: organizationId || null,
          reason: reason || 'Opted out via unsubscribe link',
        },
      ]);

    if (error) {
      // If it fails because of unique constraint, that means they are already unsubscribed. We can consider it success.
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already unsubscribed' });
      }
      console.error('Failed to unsubscribe:', error);
      return NextResponse.json({ error: 'Failed to process unsubscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

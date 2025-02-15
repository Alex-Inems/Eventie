// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!; // Your Paystack secret key

// Helper function to verify Paystack webhook signature
const verifyPaystackSignature = (signature: string | null, payload: string | null) => {
  if (!signature || !payload) {
    throw new Error('Missing signature or payload');
  }

  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');

  return signature === hash;
};

// Handle the Paystack webhook
export async function POST(req: NextRequest) {
  try {
    // Read the raw body as text
    const payload = await req.text();
    const signature = req.headers.get('x-paystack-signature'); // Paystack signature header

    // Verify the Paystack signature
    if (!verifyPaystackSignature(signature, payload)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the payload if signature is valid
    const event = JSON.parse(payload);

    // Handle different event types (e.g., payment success, failure, etc.)
    if (event.event === 'charge.success') {
      // Handle successful payment
      console.log('Payment successful:', event.data);
      // TODO: Update order status, notify user, etc.
    } else if (event.event === 'charge.failed') {
      // Handle failed payment
      console.log('Payment failed:', event.data);
      // TODO: Handle failed payment (e.g., notify user)
    }

    // Return a response to acknowledge receipt of the webhook
    return NextResponse.json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

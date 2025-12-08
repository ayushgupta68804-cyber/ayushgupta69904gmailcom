import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

// Helper to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expectedSignature = bufferToHex(signatureBuffer);
  
  return expectedSignature === signature;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
    
    if (!WEBHOOK_SECRET) {
      console.error('Webhook secret not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      console.error('No signature in request');
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    
    // Verify webhook signature
    const isValid = await verifySignature(body, signature, WEBHOOK_SECRET);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = JSON.parse(body);
    console.log('Webhook event received:', payload.event);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle payment.captured event
    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert from paise
      const method = payment.method;
      const notes = payment.notes || {};

      const eventRequestId = notes.event_request_id;
      const paymentType = notes.payment_type || 'advance';
      const userId = notes.user_id;

      if (!eventRequestId || !userId) {
        console.error('Missing event_request_id or user_id in payment notes');
        return new Response(
          JSON.stringify({ error: 'Missing required payment metadata' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if payment already recorded (idempotency)
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('transaction_id', paymentId)
        .single();

      if (existingPayment) {
        console.log('Payment already recorded:', paymentId);
        return new Response(
          JSON.stringify({ success: true, message: 'Payment already recorded' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Insert payment record
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .insert({
          event_request_id: eventRequestId,
          user_id: userId,
          payment_type: paymentType,
          amount: amount,
          status: 'completed',
          payment_method: method,
          transaction_id: paymentId,
          payment_gateway: 'razorpay',
          paid_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Failed to insert payment record:', paymentError);
        return new Response(
          JSON.stringify({ error: 'Failed to record payment' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Payment recorded:', paymentRecord.id);

      // Update event request status
      const newStatus = paymentType === 'advance' ? 'confirmed' : 'payment_complete';
      const { error: updateError } = await supabase
        .from('event_requests')
        .update({ status: newStatus })
        .eq('id', eventRequestId);

      if (updateError) {
        console.error('Failed to update event request status:', updateError);
      }

      // Trigger invoice generation (async)
      try {
        await supabase.functions.invoke('generate-invoice', {
          body: { payment_id: paymentRecord.id },
        });
      } catch (invoiceError) {
        console.error('Failed to trigger invoice generation:', invoiceError);
        // Don't fail the webhook for invoice issues
      }

      // Trigger email notification (async)
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'payment_success',
            payment_id: paymentRecord.id,
          },
        });
      } catch (emailError) {
        console.error('Failed to trigger email notification:', emailError);
        // Don't fail the webhook for email issues
      }

      return new Response(
        JSON.stringify({ success: true, payment_id: paymentRecord.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle payment.failed event
    if (payload.event === 'payment.failed') {
      const payment = payload.payload.payment.entity;
      console.log('Payment failed:', payment.id, payment.error_description);
      
      // Optionally record failed payment for analytics
      return new Response(
        JSON.stringify({ success: true, message: 'Failure acknowledged' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For other events, just acknowledge
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

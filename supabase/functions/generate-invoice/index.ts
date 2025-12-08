import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateInvoiceNumber(paymentId: string, createdAt: Date): string {
  const year = createdAt.getFullYear();
  const month = String(createdAt.getMonth() + 1).padStart(2, '0');
  const shortId = paymentId.slice(0, 8).toUpperCase();
  return `TDE-${year}${month}-${shortId}`;
}

function generateInvoiceHTML(data: {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  location: string;
  paymentType: string;
  amount: number;
  transactionId: string;
  paidAt: string;
}): string {
  const gstRate = 0.18;
  const baseAmount = data.amount / (1 + gstRate);
  const gstAmount = data.amount - baseAmount;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; background: #fff; }
    .invoice { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #D4AF37; }
    .logo-sub { font-size: 12px; color: #666; margin-top: 4px; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 32px; color: #333; margin-bottom: 8px; }
    .invoice-number { font-size: 14px; color: #666; }
    .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .details-section { flex: 1; }
    .details-section h3 { font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 10px; letter-spacing: 1px; }
    .details-section p { font-size: 14px; line-height: 1.8; }
    .event-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .event-details h3 { font-size: 14px; color: #D4AF37; margin-bottom: 12px; }
    .event-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    .event-info-item label { font-size: 11px; color: #999; text-transform: uppercase; display: block; }
    .event-info-item span { font-size: 14px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #333; color: #fff; padding: 12px 15px; text-align: left; font-size: 12px; text-transform: uppercase; }
    td { padding: 15px; border-bottom: 1px solid #eee; font-size: 14px; }
    .amount { text-align: right; }
    .totals { margin-left: auto; width: 300px; }
    .totals-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .totals-row.total { border-top: 2px solid #333; border-bottom: none; font-size: 18px; font-weight: bold; margin-top: 10px; padding-top: 15px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999; }
    .paid-stamp { position: absolute; top: 50%; right: 10%; transform: rotate(-15deg); font-size: 48px; color: rgba(0, 180, 0, 0.2); font-weight: bold; border: 4px solid rgba(0, 180, 0, 0.2); padding: 10px 30px; border-radius: 10px; }
    .status-badge { display: inline-block; background: #28a745; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="invoice" style="position: relative;">
    <div class="paid-stamp">PAID</div>
    
    <div class="header">
      <div>
        <div class="logo">✨ The Dreamers Event</div>
        <div class="logo-sub">Crafting Unforgettable Moments</div>
      </div>
      <div class="invoice-title">
        <h1>INVOICE</h1>
        <div class="invoice-number">${data.invoiceNumber}</div>
        <div class="status-badge">Payment Complete</div>
      </div>
    </div>

    <div class="details">
      <div class="details-section">
        <h3>Bill To</h3>
        <p>
          <strong>${data.customerName}</strong><br>
          ${data.customerEmail}<br>
          ${data.customerPhone}
        </p>
      </div>
      <div class="details-section" style="text-align: right;">
        <h3>Payment Details</h3>
        <p>
          Date: ${new Date(data.paidAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}<br>
          Transaction ID: ${data.transactionId}<br>
          Payment Type: ${data.paymentType === 'advance' ? 'Advance Payment' : 'Final Payment'}
        </p>
      </div>
    </div>

    <div class="event-details">
      <h3>Event Details</h3>
      <div class="event-info">
        <div class="event-info-item">
          <label>Event Type</label>
          <span>${data.eventType}</span>
        </div>
        <div class="event-info-item">
          <label>Event Date</label>
          <span>${new Date(data.eventDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="event-info-item">
          <label>Location</label>
          <span>${data.location}</span>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Event Planning Services</strong><br>
            <span style="font-size: 12px; color: #666;">
              ${data.paymentType === 'advance' ? 'Advance payment for event booking' : 'Final payment for event services'}
            </span>
          </td>
          <td class="amount">₹${baseAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>₹${baseAmount.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>GST (18%)</span>
        <span>₹${gstAmount.toFixed(2)}</span>
      </div>
      <div class="totals-row total">
        <span>Total Paid</span>
        <span>₹${data.amount.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <p><strong>The Dreamers Event</strong></p>
      <p>Email: thedreamersevents1@gmail.com | Phone: +91 87663 53710</p>
      <p>Jaipur, Delhi NCR, Dehradun, Lucknow, Prayagraj & PAN India</p>
      <p style="margin-top: 15px;">Thank you for choosing The Dreamers Event!</p>
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { payment_id } = await req.json();

    if (!payment_id) {
      return new Response(
        JSON.stringify({ error: 'Missing payment_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch payment with related data
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        event_requests (
          id,
          event_type,
          event_date,
          location,
          user_id
        )
      `)
      .eq('id', payment_id)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', payment.user_id)
      .single();

    const invoiceNumber = generateInvoiceNumber(payment.id, new Date(payment.created_at));

    // Generate HTML invoice
    const htmlContent = generateInvoiceHTML({
      invoiceNumber,
      customerName: profile?.full_name || 'Customer',
      customerEmail: profile?.email || '',
      customerPhone: profile?.phone || '',
      eventType: payment.event_requests?.event_type || 'Event',
      eventDate: payment.event_requests?.event_date || '',
      location: payment.event_requests?.location || '',
      paymentType: payment.payment_type,
      amount: payment.amount,
      transactionId: payment.transaction_id || payment.id,
      paidAt: payment.paid_at || payment.created_at,
    });

    // Convert HTML to PDF using Deno's experimental PDF generation
    // For production, consider using a dedicated PDF service
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const fileName = `${payment.user_id}/${invoiceNumber}.html`;

    // Upload HTML invoice to storage
    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(fileName, htmlBlob, {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      console.error('Failed to upload invoice:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to save invoice' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get signed URL
    const { data: signedUrl } = await supabase.storage
      .from('invoices')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year validity

    // Update payment with invoice URL
    const { error: updateError } = await supabase
      .from('payments')
      .update({ invoice_url: signedUrl?.signedUrl })
      .eq('id', payment_id);

    if (updateError) {
      console.error('Failed to update payment with invoice URL:', updateError);
    }

    console.log('Invoice generated successfully:', invoiceNumber);

    return new Response(
      JSON.stringify({
        success: true,
        invoice_number: invoiceNumber,
        invoice_url: signedUrl?.signedUrl,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Invoice generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

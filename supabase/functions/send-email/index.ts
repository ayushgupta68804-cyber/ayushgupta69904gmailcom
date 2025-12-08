import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType = 
  | 'event_submitted'
  | 'plans_generated'
  | 'plan_approved'
  | 'payment_success'
  | 'event_confirmed'
  | 'event_completed'
  | 'welcome';

interface EmailRequest {
  type: EmailType;
  user_id?: string;
  event_request_id?: string;
  payment_id?: string;
  to?: string;
  custom_data?: Record<string, unknown>;
}

const EMAIL_FROM = "The Dreamers Event <onboarding@resend.dev>";

async function sendEmail(apiKey: string, to: string, subject: string, html: string): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Resend API error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

function getBaseTemplate(content: string, previewText: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${previewText}</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #D4AF37, #B8860B); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .header .logo { font-size: 32px; margin-bottom: 10px; }
    .content { padding: 40px 30px; }
    .footer { background: #1a1a1a; padding: 30px; text-align: center; color: #999; font-size: 12px; }
    .footer a { color: #D4AF37; text-decoration: none; }
    .button { display: inline-block; background: linear-gradient(135deg, #D4AF37, #B8860B); color: #1a1a1a !important; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .highlight-box { background: #f9f6e8; border-left: 4px solid #D4AF37; padding: 20px; margin: 20px 0; border-radius: 4px; }
    h2 { color: #333; margin-top: 0; }
    p { color: #555; line-height: 1.7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✨</div>
      <h1>The Dreamers Event</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} The Dreamers Event. All rights reserved.</p>
      <p>Email: <a href="mailto:thedreamersevents1@gmail.com">thedreamersevents1@gmail.com</a> | Phone: +91 87663 53710</p>
      <p>
        <a href="https://www.instagram.com/the_dreamers_events">Instagram</a> |
        <a href="#">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function getEmailContent(type: EmailType, data: Record<string, unknown>): { subject: string; html: string } {
  switch (type) {
    case 'welcome':
      return {
        subject: 'Welcome to The Dreamers Event! ✨',
        html: getBaseTemplate(`
          <h2>Welcome, ${data.name || 'there'}! 🎉</h2>
          <p>Thank you for joining The Dreamers Event. We're thrilled to have you!</p>
          <p>We specialize in creating magical moments for weddings, birthdays, corporate events, and celebrations.</p>
          <div class="highlight-box">
            <strong>Ready to plan your dream event?</strong>
            <p style="margin-bottom: 0;">Tell us about your vision and let our AI-powered planning create the perfect experience.</p>
          </div>
          <center>
            <a href="${data.appUrl}/request" class="button">Start Planning Your Event</a>
          </center>
          <p>Warm regards,<br><strong>The Dreamers Event Team</strong></p>
        `, 'Welcome to The Dreamers Event')
      };

    case 'event_submitted':
      return {
        subject: 'Event Request Received - We\'re On It! 🎊',
        html: getBaseTemplate(`
          <h2>Thank You for Your Event Request!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>We've received your event request and our team is already working on creating amazing plans for you.</p>
          <div class="highlight-box">
            <strong>What happens next?</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Our AI will generate personalized event plans</li>
              <li>You'll receive 3 curated options to choose from</li>
              <li>Select your favorite and we'll make it happen!</li>
            </ul>
          </div>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #D4AF37;">Event Details</h3>
            <p><strong>Event Type:</strong> ${data.eventType}</p>
            <p><strong>Date:</strong> ${data.eventDate}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Guest Count:</strong> ${data.guestCount}</p>
          </div>
          <center>
            <a href="${data.appUrl}/dashboard" class="button">Track Your Request</a>
          </center>
        `, 'Event Request Received')
      };

    case 'plans_generated':
      return {
        subject: 'Your Event Plans Are Ready! 🎨',
        html: getBaseTemplate(`
          <h2>Great News - Your Plans Are Ready!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>Our AI has crafted 3 unique event plans tailored to your vision.</p>
          <div class="highlight-box">
            <strong>Your personalized plans include:</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li><strong>Premium Plan</strong> - The ultimate luxury experience</li>
              <li><strong>Balanced Plan</strong> - Perfect blend of elegance and value</li>
              <li><strong>Budget-Friendly Plan</strong> - Beautiful event, smart spending</li>
            </ul>
          </div>
          <center>
            <a href="${data.appUrl}/dashboard" class="button">View Your Plans</a>
          </center>
        `, 'Your Event Plans Are Ready')
      };

    case 'payment_success':
      return {
        subject: 'Payment Confirmed - Thank You! 💳',
        html: getBaseTemplate(`
          <h2>Payment Successfully Received!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>Thank you for your payment. Your transaction has been processed successfully.</p>
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
            <div style="font-size: 24px; font-weight: bold; color: #2e7d32;">₹${data.amount}</div>
            <div style="color: #666;">Payment ${data.paymentType === 'advance' ? 'Advance' : 'Final'}</div>
          </div>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Date:</strong> ${data.paidAt}</p>
            <p><strong>Event:</strong> ${data.eventType}</p>
          </div>
          ${data.invoiceUrl ? `
          <center>
            <a href="${data.invoiceUrl}" class="button">Download Invoice</a>
          </center>
          ` : ''}
          <p>Your event is now confirmed! Our team will be in touch with next steps.</p>
        `, 'Payment Confirmed')
      };

    case 'event_confirmed':
      return {
        subject: 'Event Confirmed - Let\'s Make Magic! ✨',
        html: getBaseTemplate(`
          <h2>Your Event is Officially Confirmed!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>Your event is locked in and our team is preparing to bring your vision to life.</p>
          <div class="highlight-box">
            <strong>What's Next?</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Our coordinator will contact you within 24 hours</li>
              <li>We'll finalize all venue and vendor arrangements</li>
              <li>You'll receive a detailed event timeline</li>
            </ul>
          </div>
          <center>
            <a href="${data.appUrl}/dashboard" class="button">View Event Details</a>
          </center>
        `, 'Event Confirmed')
      };

    case 'event_completed':
      return {
        subject: 'How Was Your Event? We\'d Love Your Feedback! 💝',
        html: getBaseTemplate(`
          <h2>Thank You for Celebrating With Us!</h2>
          <p>Hi ${data.name || 'there'},</p>
          <p>We hope your event was everything you dreamed of and more!</p>
          <div class="highlight-box">
            <strong>We'd love to hear from you!</strong>
            <p style="margin-bottom: 0;">Your feedback helps us improve and serve you better.</p>
          </div>
          <center>
            <a href="${data.appUrl}/dashboard" class="button">Share Your Feedback</a>
          </center>
          <p>With gratitude,<br><strong>The Dreamers Event Team</strong></p>
        `, 'We\'d Love Your Feedback')
      };

    default:
      return {
        subject: 'Update from The Dreamers Event',
        html: getBaseTemplate(`
          <h2>Hello!</h2>
          <p>You have a new update from The Dreamers Event.</p>
          <center>
            <a href="${data.appUrl || '#'}/dashboard" class="button">View Dashboard</a>
          </center>
        `, 'Update from The Dreamers Event')
      };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, skipping email");
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, user_id, event_request_id, payment_id, to, custom_data }: EmailRequest = await req.json();

    let recipientEmail = to;
    let emailData: Record<string, unknown> = { 
      appUrl: 'https://txcqmiglgnemldrdbmef.lovable.app',
      ...custom_data 
    };

    // Fetch user data if user_id provided
    if (user_id && !to) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user_id)
        .single();

      if (profile) {
        recipientEmail = profile.email;
        emailData.name = profile.full_name;
      }
    }

    // Fetch event request data if needed
    if (event_request_id) {
      const { data: eventRequest } = await supabase
        .from('event_requests')
        .select('*')
        .eq('id', event_request_id)
        .single();

      if (eventRequest) {
        emailData.eventType = eventRequest.event_type;
        emailData.eventDate = eventRequest.event_date;
        emailData.location = eventRequest.location;
        emailData.guestCount = eventRequest.guest_count;
        
        // Get user profile for event
        if (!recipientEmail) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', eventRequest.user_id)
            .single();
          
          if (profile) {
            recipientEmail = profile.email;
            emailData.name = emailData.name || profile.full_name;
          }
        }
      }
    }

    // Fetch payment data if needed
    if (payment_id) {
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('id', payment_id)
        .single();

      if (payment) {
        emailData.amount = payment.amount;
        emailData.paymentType = payment.payment_type;
        emailData.transactionId = payment.transaction_id;
        emailData.paidAt = new Date(payment.paid_at || payment.created_at).toLocaleString('en-IN');
        emailData.invoiceUrl = payment.invoice_url;

        // Get event details
        const { data: eventRequest } = await supabase
          .from('event_requests')
          .select('event_type')
          .eq('id', payment.event_request_id)
          .single();
        
        if (eventRequest) {
          emailData.eventType = eventRequest.event_type;
        }

        // Get user email if not set
        if (!recipientEmail) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', payment.user_id)
            .single();
          
          if (profile) {
            recipientEmail = profile.email;
            emailData.name = emailData.name || profile.full_name;
          }
        }
      }
    }

    if (!recipientEmail) {
      console.error("No recipient email found");
      return new Response(
        JSON.stringify({ error: "No recipient email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { subject, html } = getEmailContent(type, emailData);

    console.log(`Sending ${type} email to ${recipientEmail}`);

    const result = await sendEmail(RESEND_API_KEY, recipientEmail, subject, html);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully:", result.id);

    return new Response(
      JSON.stringify({ success: true, email_id: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

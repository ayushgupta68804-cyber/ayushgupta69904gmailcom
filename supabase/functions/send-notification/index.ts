import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "booking_confirmation" | "plan_approval" | "payment_success" | "event_completed";
  email: string;
  userName: string;
  eventType?: string;
  eventDate?: string;
  amount?: number;
  transactionId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, userName, eventType, eventDate, amount, transactionId }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification to ${email}`);

    // For now, we'll log the notification. In production, integrate with Resend/SendGrid
    // This can be enhanced with actual email sending when RESEND_API_KEY is configured

    const notificationMessages = {
      booking_confirmation: {
        subject: "Booking Confirmed - The Dreamers Event",
        body: `Dear ${userName},\n\nYour ${eventType} event booking for ${eventDate} has been confirmed. Our team will review your requirements and create personalized plans for you.\n\nContact us: 8766353710 | thedreamersevents1@gmail.com\n\nBest regards,\nThe Dreamers Event Team`,
      },
      plan_approval: {
        subject: "Your Event Plan is Ready - The Dreamers Event",
        body: `Dear ${userName},\n\nGreat news! Your personalized event plan has been approved and is ready for review. Please login to your dashboard to view the details.\n\nContact us: 8766353710 | thedreamersevents1@gmail.com\n\nBest regards,\nThe Dreamers Event Team`,
      },
      payment_success: {
        subject: "Payment Received - The Dreamers Event",
        body: `Dear ${userName},\n\nWe have received your payment of ₹${amount?.toLocaleString('en-IN')}.\nTransaction ID: ${transactionId}\n\nThank you for choosing The Dreamers Event!\n\nContact us: 8766353710 | thedreamersevents1@gmail.com\n\nBest regards,\nThe Dreamers Event Team`,
      },
      event_completed: {
        subject: "Event Completed - Share Your Feedback - The Dreamers Event",
        body: `Dear ${userName},\n\nWe hope you had an amazing ${eventType}! Your event photos and album are now available in your dashboard.\n\nPlease take a moment to share your feedback and help us improve.\n\nContact us: 8766353710 | thedreamersevents1@gmail.com\n\nBest regards,\nThe Dreamers Event Team`,
      },
    };

    const notification = notificationMessages[type];

    console.log("Notification prepared:", {
      to: email,
      subject: notification.subject,
      body: notification.body,
    });

    // TODO: When RESEND_API_KEY is configured, uncomment the following:
    /*
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const { Resend } = await import("npm:resend@2.0.0");
      const resend = new Resend(RESEND_API_KEY);
      
      await resend.emails.send({
        from: "The Dreamers Event <notifications@thedreamersevents.com>",
        to: [email],
        subject: notification.subject,
        text: notification.body,
      });
    }
    */

    return new Response(
      JSON.stringify({ success: true, message: `${type} notification logged successfully` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

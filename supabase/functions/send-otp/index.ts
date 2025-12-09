import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  phone: string;
  email?: string;
  type: "signup" | "login" | "admin_login";
}

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, email, type }: SendOTPRequest = await req.json();
    console.log(`[send-otp] Received request - phone: ${phone}, type: ${type}`);

    if (!phone) {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Clean phone number (remove spaces, dashes, and ensure +91 prefix)
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    if (!cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`;
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store OTP in database
    const { error: dbError } = await supabase.from("otp_verifications").upsert({
      phone: cleanPhone,
      email: email || null,
      otp_code: otp,
      type,
      expires_at: expiresAt.toISOString(),
      verified: false,
      attempts: 0,
    }, { onConflict: "phone,type" });

    if (dbError) {
      console.error("[send-otp] Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to store OTP" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send OTP via MSG91
    const msg91AuthKey = Deno.env.get("MSG91_AUTH_KEY");
    const msg91TemplateId = Deno.env.get("MSG91_TEMPLATE_ID");
    const msg91SenderId = Deno.env.get("MSG91_SENDER_ID") || "DREAME";

    if (!msg91AuthKey || !msg91TemplateId) {
      console.error("[send-otp] MSG91 credentials not configured");
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // MSG91 Flow API for OTP
    const msg91Response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        "authkey": msg91AuthKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template_id: msg91TemplateId,
        sender: msg91SenderId,
        short_url: "0",
        mobiles: cleanPhone.replace("+", ""),
        VAR1: otp,
      }),
    });

    const msg91Data = await msg91Response.json();
    console.log("[send-otp] MSG91 response:", msg91Data);

    if (msg91Data.type !== "success" && !msg91Response.ok) {
      console.error("[send-otp] MSG91 failed:", msg91Data);
      return new Response(
        JSON.stringify({ error: "Failed to send OTP SMS" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[send-otp] OTP sent successfully to ${cleanPhone}`);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully",
        phone: cleanPhone,
        expiresIn: 300 // 5 minutes in seconds
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("[send-otp] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

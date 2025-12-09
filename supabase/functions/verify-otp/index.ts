import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  phone: string;
  otp: string;
  type: "signup" | "login" | "admin_login";
  email?: string;
  password?: string;
  fullName?: string;
}

// Fixed admin credentials (hashed comparison in production would be better)
const ADMIN_PHONE = "+918766353710";
const ADMIN_EMAIL = "ankushgupta26507@gmail.com";
const ADMIN_PASSWORD = "Anku@8766";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp, type, email, password, fullName }: VerifyOTPRequest = await req.json();
    console.log(`[verify-otp] Verifying - phone: ${phone}, type: ${type}`);

    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ error: "Phone and OTP are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Clean phone number
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    if (!cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`;
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch OTP record
    const { data: otpRecord, error: fetchError } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("phone", cleanPhone)
      .eq("type", type)
      .maybeSingle();

    if (fetchError || !otpRecord) {
      console.error("[verify-otp] OTP record not found:", fetchError);
      return new Response(
        JSON.stringify({ error: "OTP not found. Please request a new one." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if OTP is expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "OTP has expired. Please request a new one." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check attempts (max 3)
    if (otpRecord.attempts >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many failed attempts. Please request a new OTP." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify OTP
    if (otpRecord.otp_code !== otp) {
      // Increment attempts
      await supabase
        .from("otp_verifications")
        .update({ attempts: otpRecord.attempts + 1 })
        .eq("id", otpRecord.id);
      
      return new Response(
        JSON.stringify({ error: "Invalid OTP. Please try again." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark OTP as verified
    await supabase
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    // Handle admin login verification
    if (type === "admin_login") {
      // Verify admin credentials
      if (cleanPhone !== ADMIN_PHONE) {
        return new Response(
          JSON.stringify({ error: "Invalid admin credentials" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (password !== ADMIN_PASSWORD) {
        return new Response(
          JSON.stringify({ error: "Invalid admin password" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Sign in admin user (should already exist)
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      if (signInError) {
        console.error("[verify-otp] Admin sign in error:", signInError);
        return new Response(
          JSON.stringify({ error: "Admin authentication failed" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Admin login successful",
          session: authData.session,
          user: authData.user,
          isAdmin: true
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle user signup
    if (type === "signup" && email && password) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
            phone: cleanPhone,
          },
        },
      });

      if (signUpError) {
        console.error("[verify-otp] Signup error:", signUpError);
        return new Response(
          JSON.stringify({ error: signUpError.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Signup successful",
          session: signUpData.session,
          user: signUpData.user
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle user login (OTP-based)
    if (type === "login") {
      // Find user by phone
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("phone", cleanPhone)
        .maybeSingle();

      if (profileError || !profile) {
        return new Response(
          JSON.stringify({ error: "No account found with this phone number" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Generate a magic link token for OTP login
      const { data: tokenData, error: tokenError } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: profile.email!,
      });

      if (tokenError || !tokenData) {
        console.error("[verify-otp] Magic link error:", tokenError);
        return new Response(
          JSON.stringify({ error: "Failed to authenticate" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Use the token to create a session
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.getUserById(profile.id);
      
      if (sessionError) {
        return new Response(
          JSON.stringify({ error: "Authentication failed" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "OTP verified successfully",
          verified: true,
          userId: profile.id,
          email: profile.email,
          requiresPasswordLogin: true
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "OTP verified successfully", verified: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("[verify-otp] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

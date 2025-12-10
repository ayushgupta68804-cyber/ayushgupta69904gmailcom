-- Create OTP verifications table for SMS OTP system
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  email TEXT,
  otp_code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('signup', 'login', 'admin_login')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(phone, type)
);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow edge functions (service role) to manage OTP records
-- No public access policies needed as this is handled by edge functions with service role
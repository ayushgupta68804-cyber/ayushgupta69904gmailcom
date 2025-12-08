-- STEP A: Security Fixes - Add database constraints for input validation

-- Add CHECK constraints to event_requests for server-side validation
ALTER TABLE public.event_requests 
  ADD CONSTRAINT budget_positive CHECK (budget > 0 AND budget < 100000000);

ALTER TABLE public.event_requests 
  ADD CONSTRAINT guest_count_valid CHECK (guest_count > 0 AND guest_count < 100000);

-- Add length constraints to prevent extremely long strings
ALTER TABLE public.event_requests
  ADD CONSTRAINT location_length CHECK (char_length(location) <= 500);

-- Add constraints to contact_submissions
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT message_length CHECK (char_length(message) <= 5000);

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT name_length CHECK (char_length(name) <= 200);

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT email_length CHECK (char_length(email) <= 320);

-- Create invoices storage bucket for PDF invoices
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for invoices bucket - users can view their own invoices
CREATE POLICY "Users can view their own invoices"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'invoices' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can manage all invoices
CREATE POLICY "Admins can manage invoices"
ON storage.objects FOR ALL
USING (
  bucket_id = 'invoices' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add invoice_url column to payments table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'payments' 
    AND column_name = 'invoice_url'
  ) THEN
    ALTER TABLE public.payments ADD COLUMN invoice_url text;
  END IF;
END $$;
-- Create storage bucket for event images and albums
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('albums', 'albums', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-notes', 'voice-notes', false);

-- Storage policies for event-images bucket
CREATE POLICY "Event images are publicly viewable" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own event images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own event images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for albums bucket
CREATE POLICY "Album images are publicly viewable" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'albums');

CREATE POLICY "Admins can upload album images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'albums' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update album images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'albums' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete album images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'albums' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for voice-notes bucket
CREATE POLICY "Users can view their own voice notes" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'voice-notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own voice notes" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'voice-notes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for event_requests and payments for live status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_timeline;
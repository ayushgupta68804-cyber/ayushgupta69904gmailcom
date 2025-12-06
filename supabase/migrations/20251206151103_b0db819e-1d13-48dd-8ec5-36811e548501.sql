-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create event_requests table
CREATE TABLE public.event_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  guest_count INTEGER NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT NOT NULL,
  location_coordinates JSONB,
  venue_type TEXT NOT NULL CHECK (venue_type IN ('indoor', 'outdoor')),
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('day', 'night')),
  event_scale TEXT NOT NULL CHECK (event_scale IN ('simple', 'grand')),
  voice_note_url TEXT,
  reference_images TEXT[],
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'ai_plans_ready', 'owner_reviewing', 'plan_sent', 'approved', 'payment_pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own event requests"
  ON public.event_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own event requests"
  ON public.event_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event requests"
  ON public.event_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all event requests"
  ON public.event_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all event requests"
  ON public.event_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create ai_plans table
CREATE TABLE public.ai_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id UUID NOT NULL REFERENCES public.event_requests(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('premium', 'balanced', 'budget')),
  plan_name TEXT NOT NULL,
  description TEXT,
  decoration_items JSONB NOT NULL DEFAULT '[]',
  lighting_setup JSONB NOT NULL DEFAULT '{}',
  entry_design JSONB NOT NULL DEFAULT '{}',
  dj_setup JSONB,
  stage_design JSONB,
  estimated_cost NUMERIC NOT NULL,
  profit_margin NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ai_plans"
  ON public.ai_plans FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create final_approved_plans table
CREATE TABLE public.final_approved_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id UUID NOT NULL UNIQUE REFERENCES public.event_requests(id) ON DELETE CASCADE,
  approved_by UUID NOT NULL REFERENCES auth.users(id),
  theme TEXT NOT NULL,
  stage_design TEXT NOT NULL,
  lighting_style TEXT NOT NULL,
  dj_timing TEXT,
  entry_concept TEXT NOT NULL,
  final_price NUMERIC NOT NULL,
  decoration_details JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.final_approved_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their approved plans"
  ON public.final_approved_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.event_requests er
      WHERE er.id = event_request_id AND er.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage approved plans"
  ON public.final_approved_plans FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id UUID NOT NULL REFERENCES public.event_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('advance', 'final', 'cancellation', 'damage', 'extra_work')),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  payment_gateway TEXT,
  notes TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create event_timeline table
CREATE TABLE public.event_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id UUID NOT NULL REFERENCES public.event_requests(id) ON DELETE CASCADE,
  milestone TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their event timeline"
  ON public.event_timeline FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.event_requests er
      WHERE er.id = event_request_id AND er.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all timelines"
  ON public.event_timeline FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create albums table
CREATE TABLE public.albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id UUID NOT NULL REFERENCES public.event_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  highlight_reel_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view published albums for their events"
  ON public.albums FOR SELECT
  TO authenticated
  USING (
    is_published = true AND EXISTS (
      SELECT 1 FROM public.event_requests er
      WHERE er.id = event_request_id AND er.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all albums"
  ON public.albums FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id UUID NOT NULL REFERENCES public.event_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create feedback for their events"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage contact submissions"
  ON public.contact_submissions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    NEW.email
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_requests_updated_at
  BEFORE UPDATE ON public.event_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_albums_updated_at
  BEFORE UPDATE ON public.albums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
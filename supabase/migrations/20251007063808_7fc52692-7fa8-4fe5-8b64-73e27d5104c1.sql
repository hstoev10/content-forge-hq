-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Create articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL DEFAULT 'news',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Articles policies
CREATE POLICY "Anyone can view published articles"
ON public.articles FOR SELECT
USING (published = true OR auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert articles"
ON public.articles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update articles"
ON public.articles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete articles"
ON public.articles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members"
ON public.team_members FOR SELECT
USING (true);

CREATE POLICY "Admins can manage team members"
ON public.team_members FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create awards table
CREATE TABLE public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view awards"
ON public.awards FOR SELECT
USING (true);

CREATE POLICY "Admins can manage awards"
ON public.awards FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create about page content table
CREATE TABLE public.about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about content"
ON public.about_content FOR SELECT
USING (true);

CREATE POLICY "Admins can manage about content"
ON public.about_content FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default about content
INSERT INTO public.about_content (content, mission, vision)
VALUES (
  'Добре дошли в нашата новинарска платформа.',
  'Нашата мисия е да предоставяме точна и навременна информация.',
  'Визията ни е да бъдем водещ източник на новини.'
);
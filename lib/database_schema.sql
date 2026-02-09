-- 1. TABLE PROFILES (Synchronisée avec auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  category TEXT DEFAULT 'Étudiant',
  role TEXT DEFAULT 'MEMBRE',
  status TEXT DEFAULT 'pending',
  matricule TEXT UNIQUE,
  address TEXT,
  bio TEXT,
  avatar_url TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  commissions JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TRIGGER POUR CRÉER LE PROFIL AUTOMATIQUEMENT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, category, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    COALESCE(new.raw_user_meta_data->>'category', 'Étudiant'),
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. TABLES MÉTIER
CREATE TABLE public.contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL, -- Adiyas, Sass, Diayanté
  amount INTEGER NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  event_label TEXT,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  commission TEXT NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id),
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'todo',
  due_date DATE,
  created_by TEXT,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  organizing_commission TEXT,
  description TEXT,
  status TEXT DEFAULT 'planifie'
);

-- 4. POLITIQUES RLS (Sécurité)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les membres voient tous les profils" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Les membres modifient leur propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Voir ses propres contributions" ON public.contributions FOR SELECT USING (auth.uid() = member_id);
CREATE POLICY "Admins voient tout" ON public.contributions FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SG')));
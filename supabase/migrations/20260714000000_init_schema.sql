-- PostgreSQL Database Initialization Schema for UK FITNESS
-- Designed for Supabase / PostgreSQL GoTrue Auth integrations

-- Create custom enum types
CREATE TYPE public.user_role AS ENUM ('member', 'trainer', 'admin');
CREATE TYPE public.membership_status AS ENUM ('inactive', 'active', 'suspended', 'cancelled');
CREATE TYPE public.booking_status AS ENUM ('booked', 'attended', 'cancelled', 'no_show');

-- 1. PROFILES table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role public.user_role DEFAULT 'member'::public.user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. MEMBERSHIPS table (user subscription status)
CREATE TABLE public.memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    tier_name TEXT NOT NULL, -- e.g. 'Base', 'Premium', 'Elite'
    status public.membership_status DEFAULT 'inactive'::public.membership_status NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- 3. CLASS_TYPES table (meta info about gym classes)
CREATE TABLE public.class_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    capacity INT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL -- e.g. 'HIIT', 'Yoga', 'Strength'
);

ALTER TABLE public.class_types ENABLE ROW LEVEL SECURITY;

-- 4. SCHEDULE_SLOTS table (calendar slot occurrences)
CREATE TABLE public.schedule_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_type_id UUID REFERENCES public.class_types(id) ON DELETE CASCADE NOT NULL,
    trainer_id UUID REFERENCES public.profiles(id) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    room_number TEXT,
    current_occupancy INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;

-- 5. BOOKINGS table (user class bookings)
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    schedule_slot_id UUID REFERENCES public.schedule_slots(id) ON DELETE CASCADE NOT NULL,
    status public.booking_status DEFAULT 'booked'::public.booking_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT unique_user_slot UNIQUE(user_id, schedule_slot_id)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Profiles RLS
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profiles" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Memberships RLS
CREATE POLICY "Memberships viewable by owner or admin" ON public.memberships
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Class Types RLS
CREATE POLICY "Class types are viewable by everyone" ON public.class_types
    FOR SELECT USING (true);

CREATE POLICY "Class types editable by admin only" ON public.class_types
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Schedule Slots RLS
CREATE POLICY "Schedule slots viewable by everyone" ON public.schedule_slots
    FOR SELECT USING (true);

CREATE POLICY "Schedule slots editable by admin only" ON public.schedule_slots
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Bookings RLS
CREATE POLICY "Bookings viewable by owner or admin" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can create their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own bookings" ON public.bookings
    FOR DELETE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- =========================================================================
-- TRIGGER TO AUTOMATICALLY CREATE PROFILE ON USER SIGNUP
-- =========================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Gym Member'),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'member'::public.user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

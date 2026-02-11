-- ============================================
-- CareerPath.id Database Schema
-- Version: 1.0.0
-- Description: Complete database setup for Career Operating System
-- ============================================

-- ============================================
-- 1. USERS TABLE (Extends auth.users)
-- ============================================
-- This table stores additional profile information for authenticated users

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    university TEXT,
    major TEXT,
    semester INTEGER CHECK (semester >= 1 AND semester <= 14),
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    city TEXT DEFAULT 'Makassar',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
    ON public.users FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Public profiles are viewable by everyone (optional - for community features)
CREATE POLICY "Public profiles are viewable" 
    ON public.users FOR SELECT 
    USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS users_university_idx ON public.users(university);
CREATE INDEX IF NOT EXISTS users_major_idx ON public.users(major);

-- ============================================
-- 2. CAREERS TABLE (Katalog Pekerjaan Impian)
-- ============================================
-- Master data for career paths/job titles

CREATE TABLE IF NOT EXISTS public.careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    salary_range_min INTEGER, -- in IDR thousands (e.g., 5000 = Rp 5.000.000)
    salary_range_max INTEGER,
    industry TEXT,
    job_type TEXT CHECK (job_type IN ('Full-time', 'Part-time', 'Freelance', 'Internship', 'Remote')),
    experience_level TEXT CHECK (experience_level IN ('Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager')),
    demand_level TEXT CHECK (demand_level IN ('Low', 'Medium', 'High', 'Very High')),
    growth_outlook TEXT,
    icon_name TEXT, -- Lucide icon name
    color TEXT, -- Tailwind color class
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Everyone can view careers (public data)
CREATE POLICY "Careers are viewable by everyone" 
    ON public.careers FOR SELECT 
    USING (true);

-- Only admins can modify careers (we'll handle this in application logic for now)
-- For production, you'd create an admin role

CREATE INDEX IF NOT EXISTS careers_industry_idx ON public.careers(industry);
CREATE INDEX IF NOT EXISTS careers_demand_idx ON public.careers(demand_level);

-- ============================================
-- 3. SKILLS TABLE (Bank Kompetensi)
-- ============================================
-- Master data for all skills in the system

CREATE TYPE skill_category AS ENUM ('Hard Skill', 'Soft Skill');

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category skill_category NOT NULL,
    description TEXT,
    icon_name TEXT, -- Lucide icon name
    learning_resources JSONB, -- Array of learning resource URLs
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Everyone can view skills (public data)
CREATE POLICY "Skills are viewable by everyone" 
    ON public.skills FOR SELECT 
    USING (true);

CREATE INDEX IF NOT EXISTS skills_category_idx ON public.skills(category);
CREATE INDEX IF NOT EXISTS skills_name_idx ON public.skills(name);

-- ============================================
-- 4. CAREER_SKILLS TABLE (Pivot Many-to-Many)
-- ============================================
-- Links careers to required skills

CREATE TYPE skill_importance AS ENUM ('Essential', 'Important', 'Nice to Have');

CREATE TABLE IF NOT EXISTS public.career_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    importance skill_importance DEFAULT 'Important',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate career-skill combinations
    UNIQUE(career_id, skill_id)
);

-- Enable RLS
ALTER TABLE public.career_skills ENABLE ROW LEVEL SECURITY;

-- Everyone can view career-skill relationships
CREATE POLICY "Career skills are viewable by everyone" 
    ON public.career_skills FOR SELECT 
    USING (true);

CREATE INDEX IF NOT EXISTS career_skills_career_idx ON public.career_skills(career_id);
CREATE INDEX IF NOT EXISTS career_skills_skill_idx ON public.career_skills(skill_id);

-- ============================================
-- 5. USER_SKILLS TABLE (Tracking Progres User)
-- ============================================
-- Tracks user's skill progress and proficiency

CREATE TYPE proficiency_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');

CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level proficiency_level DEFAULT 'Beginner',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    hours_practiced INTEGER DEFAULT 0,
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate user-skill combinations
    UNIQUE(user_id, skill_id)
);

-- Enable RLS
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- Users can view their own skills
CREATE POLICY "Users can view own skills" 
    ON public.user_skills FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can insert their own skills
CREATE POLICY "Users can insert own skills" 
    ON public.user_skills FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own skills
CREATE POLICY "Users can update own skills" 
    ON public.user_skills FOR UPDATE 
    USING (auth.uid() = user_id);

-- Users can delete their own skills
CREATE POLICY "Users can delete own skills" 
    ON public.user_skills FOR DELETE 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS user_skills_user_idx ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS user_skills_skill_idx ON public.user_skills(skill_id);
CREATE INDEX IF NOT EXISTS user_skills_proficiency_idx ON public.user_skills(proficiency_level);

-- ============================================
-- 6. MENTAL_HEALTH_LOGS TABLE (Fitur Wellness)
-- ============================================
-- Stores mental health check-ins and GAD-7 anxiety scores

CREATE TYPE mood_type AS ENUM ('Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good');

CREATE TABLE IF NOT EXISTS public.mental_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    gad7_score INTEGER CHECK (gad7_score >= 0 AND gad7_score <= 21), -- GAD-7 scale: 0-21
    mood mood_type,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    notes TEXT,
    activities TEXT[], -- Array of activities done that day
    gratitude TEXT[], -- Things user is grateful for
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.mental_health_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own mental health logs (PRIVATE DATA)
CREATE POLICY "Users can view own mental health logs" 
    ON public.mental_health_logs FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can insert their own logs
CREATE POLICY "Users can insert own mental health logs" 
    ON public.mental_health_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own logs
CREATE POLICY "Users can update own mental health logs" 
    ON public.mental_health_logs FOR UPDATE 
    USING (auth.uid() = user_id);

-- Users can delete their own logs
CREATE POLICY "Users can delete own mental health logs" 
    ON public.mental_health_logs FOR DELETE 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS mental_health_user_idx ON public.mental_health_logs(user_id);
CREATE INDEX IF NOT EXISTS mental_health_date_idx ON public.mental_health_logs(created_at);
CREATE INDEX IF NOT EXISTS mental_health_gad7_idx ON public.mental_health_logs(gad7_score);

-- ============================================
-- 7. USER_CAREERS TABLE (User's Dream Careers)
-- ============================================
-- Tracks which careers a user is interested in

CREATE TABLE IF NOT EXISTS public.user_careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false, -- Primary dream career
    match_percentage INTEGER DEFAULT 0 CHECK (match_percentage >= 0 AND match_percentage <= 100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, career_id)
);

-- Enable RLS
ALTER TABLE public.user_careers ENABLE ROW LEVEL SECURITY;

-- Users can view their own career interests
CREATE POLICY "Users can view own careers" 
    ON public.user_careers FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can manage their own career interests
CREATE POLICY "Users can insert own careers" 
    ON public.user_careers FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own careers" 
    ON public.user_careers FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own careers" 
    ON public.user_careers FOR DELETE 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS user_careers_user_idx ON public.user_careers(user_id);
CREATE INDEX IF NOT EXISTS user_careers_career_idx ON public.user_careers(career_id);

-- ============================================
-- 8. HELPER FUNCTIONS
-- ============================================

-- Function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_careers_updated_at
    BEFORE UPDATE ON public.careers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at
    BEFORE UPDATE ON public.user_skills
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_careers_updated_at
    BEFORE UPDATE ON public.user_careers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 9. CALCULATE CAREER MATCH PERCENTAGE
-- ============================================

CREATE OR REPLACE FUNCTION public.calculate_career_match(p_user_id UUID, p_career_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_skills INTEGER;
    user_skills_count INTEGER;
    weighted_score DECIMAL;
BEGIN
    -- Get total required skills for the career
    SELECT COUNT(*) INTO total_skills
    FROM public.career_skills
    WHERE career_id = p_career_id;
    
    IF total_skills = 0 THEN
        RETURN 0;
    END IF;
    
    -- Calculate weighted score based on user's skills and proficiency
    SELECT COALESCE(SUM(
        CASE 
            WHEN us.proficiency_level = 'Expert' THEN 1.0
            WHEN us.proficiency_level = 'Advanced' THEN 0.8
            WHEN us.proficiency_level = 'Intermediate' THEN 0.5
            WHEN us.proficiency_level = 'Beginner' THEN 0.2
            ELSE 0
        END
    ), 0) INTO weighted_score
    FROM public.career_skills cs
    LEFT JOIN public.user_skills us ON us.skill_id = cs.skill_id AND us.user_id = p_user_id
    WHERE cs.career_id = p_career_id;
    
    RETURN ROUND((weighted_score / total_skills) * 100)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMPLETE! Database schema is ready.
-- ============================================

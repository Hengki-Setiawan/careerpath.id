-- Migration: 007_gamification.sql
-- Description: Add XP, Level to users and create Quizzes schema

-- 1. Add XP and Level to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- 2. Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL, -- Optional link to course
    xp_reward INTEGER DEFAULT 100,
    min_pass_score INTEGER DEFAULT 70, -- Percentage required to pass
    time_limit_minutes INTEGER DEFAULT 15,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Quiz Questions Table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- ["Option A", "Option B", "Option C", "Option D"]
    correct_option_index INTEGER NOT NULL, -- 0-based index
    explanation TEXT, -- Shown after answering
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- Percentage (0-100)
    is_passed BOOLEAN DEFAULT false,
    earned_xp INTEGER DEFAULT 0,
    answers JSONB, -- Store user answers for review usually [{"questionId": "...", "selectedOption": 0}, ...]
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Quizzes: Public read if active
CREATE POLICY "Anyone can view active quizzes" 
    ON public.quizzes FOR SELECT 
    USING (is_active = true);

-- Quiz Questions: Public read (or authenticated only?) - Public for now to be safe
CREATE POLICY "Anyone can view quiz questions" 
    ON public.quiz_questions FOR SELECT 
    USING (true);

-- User Quiz Attempts: Users manage their own
CREATE POLICY "Users can view own attempts" 
    ON public.user_quiz_attempts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" 
    ON public.user_quiz_attempts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 7. Functions for XP and Leveling

-- Function to add XP and check level up
-- Level formula: Level = floor(sqrt(XP / 100)) + 1
-- Or simple: Level 1 = 0-1000, Level 2 = 1001-2500, etc.
-- Let's use a simple formula: Threshold = Level * 1000? 
-- Let's stick to a linear/exponential curve or just store it.
-- For MVP: Update XP, then recalculate Level.

CREATE OR REPLACE FUNCTION public.add_xp(user_id UUID, xp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
    current_xp INTEGER;
    new_xp INTEGER;
    new_level INTEGER;
BEGIN
    -- Get current user data
    SELECT xp INTO current_xp FROM public.users WHERE id = user_id;
    IF current_xp IS NULL THEN current_xp := 0; END IF;
    
    new_xp := current_xp + xp_amount;
    
    -- Simple leveling: 1 level per 1000 XP
    new_level := (new_xp / 1000) + 1;
    
    -- Update user
    UPDATE public.users 
    SET xp = new_xp, level = new_level
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Seed Dummy Quizzes
-- Insert a sample quiz for a course (Assuming course IDs exist, but hard to know IDs. 
-- We will insert a generic quiz not linked to a generic course or lookup a course if possible)

DO $$ 
DECLARE 
    course_js_id UUID;
    quiz_id UUID;
BEGIN
    -- Try to find JavaScript course
    SELECT id INTO course_js_id FROM public.courses WHERE title LIKE '%JavaScript%' LIMIT 1;
    
    IF course_js_id IS NOT NULL THEN
        -- Create Quiz
        INSERT INTO public.quizzes (title, description, course_id, xp_reward)
        VALUES ('JavaScript Basics Quiz', 'Uji pemahamanmu tentang dasar-dasar JavaScript', course_js_id, 150)
        RETURNING id INTO quiz_id;
        
        -- Add Questions
        INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option_index, explanation)
        VALUES 
        (quiz_id, 'Apa itu JavaScript?', '["Bahasa markup", "Bahasa pemrograman", "Database", "Sistem operasi"]'::jsonb, 1, 'JavaScript adalah bahasa pemrograman yang digunakan untuk pengembangan web.'),
        (quiz_id, 'Manakah yang BUKAN tipe data primitive di JS?', '["String", "Number", "Boolean", "Object"]'::jsonb, 3, 'Object adalah tipe data kompleks/reference, bukan primitive.'),
        (quiz_id, 'Cara mendeklarasikan variabel yang nilainya tidak bisa diubah?', '["var", "let", "const", "static"]'::jsonb, 2, 'const digunakan untuk variabel constant.');
    END IF;
END $$;

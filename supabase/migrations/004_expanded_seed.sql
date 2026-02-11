-- ============================================
-- CareerPath.id Expanded Data
-- Description: Additional careers, skills, and courses for production
-- ============================================

-- ============================================
-- 1. COURSES TABLE (Learning Resources)
-- ============================================

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    provider TEXT NOT NULL, -- Coursera, YouTube, Dicoding, etc.
    url TEXT,
    thumbnail_url TEXT,
    duration_hours INTEGER,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(12, 2) DEFAULT 0,
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
    enrolled_count INTEGER DEFAULT 0,
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    career_id UUID REFERENCES public.careers(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Everyone can view courses
CREATE POLICY "Courses are viewable by everyone" 
    ON public.courses FOR SELECT 
    USING (true);

CREATE INDEX IF NOT EXISTS courses_skill_idx ON public.courses(skill_id);
CREATE INDEX IF NOT EXISTS courses_career_idx ON public.courses(career_id);
CREATE INDEX IF NOT EXISTS courses_difficulty_idx ON public.courses(difficulty);
CREATE INDEX IF NOT EXISTS courses_provider_idx ON public.courses(provider);

-- ============================================
-- 2. USER_COURSES TABLE (Track Progress)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

-- Users can manage their own course progress
CREATE POLICY "Users can view own course progress" 
    ON public.user_courses FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course progress" 
    ON public.user_courses FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress" 
    ON public.user_courses FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own course progress" 
    ON public.user_courses FOR DELETE 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS user_courses_user_idx ON public.user_courses(user_id);
CREATE INDEX IF NOT EXISTS user_courses_course_idx ON public.user_courses(course_id);

-- ============================================
-- 3. ADD MORE CAREERS
-- ============================================

INSERT INTO public.careers (title, description, salary_range_min, salary_range_max, industry, job_type, experience_level, demand_level, growth_outlook, icon_name, color)
VALUES
    -- More Tech Careers
    ('Mobile Developer', 'Membangun aplikasi mobile untuk iOS dan Android menggunakan React Native, Flutter, atau native development.', 8000, 35000, 'Technology', 'Full-time', 'Entry Level', 'Very High', 'Mobile-first semakin dominan', 'Smartphone', 'blue'),
    ('Cloud Engineer', 'Mengelola infrastruktur cloud, deployment, dan skalabilitas aplikasi di AWS, GCP, atau Azure.', 12000, 45000, 'Technology', 'Full-time', 'Mid Level', 'High', 'Cloud adoption terus meningkat', 'Cloud', 'sky'),
    ('AI/ML Engineer', 'Membangun dan mengimplementasikan model machine learning dan artificial intelligence.', 15000, 50000, 'Technology', 'Full-time', 'Mid Level', 'Very High', 'AI revolution membuka banyak peluang', 'Brain', 'violet'),
    ('Cybersecurity Analyst', 'Melindungi sistem dan data perusahaan dari ancaman keamanan siber.', 10000, 40000, 'Technology', 'Full-time', 'Mid Level', 'Very High', 'Keamanan siber semakin critical', 'Shield', 'red'),
    ('Quality Assurance', 'Memastikan kualitas software melalui testing manual dan otomatis.', 6000, 22000, 'Technology', 'Full-time', 'Entry Level', 'High', 'QA essential di setiap tim development', 'CheckCircle', 'green'),
    ('Fullstack Developer', 'Mengembangkan frontend dan backend aplikasi web secara menyeluruh.', 10000, 40000, 'Technology', 'Full-time', 'Mid Level', 'Very High', 'Versatility sangat dihargai', 'Layers', 'indigo'),
    
    -- Creative & Media
    ('Motion Graphics Designer', 'Membuat animasi dan motion graphics untuk video, iklan, dan media digital.', 6000, 25000, 'Creative', 'Freelance', 'Entry Level', 'High', 'Video content terus mendominasi', 'Play', 'purple'),
    ('Podcast Producer', 'Memproduksi, mengedit, dan mengelola podcast dari konsep hingga distribusi.', 4000, 15000, 'Creative', 'Freelance', 'Entry Level', 'High', 'Podcast semakin populer di Indonesia', 'Mic', 'rose'),
    
    -- Business & Management
    ('Startup Founder', 'Membangun dan mengembangkan startup dari ide hingga scale-up.', 0, 100000, 'Business', 'Full-time', 'Lead/Manager', 'Medium', 'Ekosistem startup Indonesia berkembang pesat', 'Rocket', 'orange'),
    ('E-commerce Specialist', 'Mengelola toko online dan strategi penjualan di marketplace.', 5000, 20000, 'Business', 'Full-time', 'Entry Level', 'Very High', 'E-commerce terus tumbuh eksponensial', 'ShoppingCart', 'emerald')

ON CONFLICT (title) DO NOTHING;

-- ============================================
-- 4. ADD MORE SKILLS
-- ============================================

INSERT INTO public.skills (name, category, description, icon_name)
VALUES
    -- Mobile Development
    ('React Native', 'Hard Skill', 'Framework untuk membangun aplikasi mobile cross-platform', 'Smartphone'),
    ('Flutter', 'Hard Skill', 'SDK Google untuk mobile app development', 'Layers'),
    ('Swift', 'Hard Skill', 'Bahasa pemrograman untuk iOS development', 'Apple'),
    ('Kotlin', 'Hard Skill', 'Bahasa modern untuk Android development', 'Code'),
    
    -- Cloud & DevOps
    ('AWS', 'Hard Skill', 'Amazon Web Services cloud platform', 'Cloud'),
    ('Docker', 'Hard Skill', 'Containerization platform', 'Box'),
    ('Kubernetes', 'Hard Skill', 'Container orchestration system', 'Boxes'),
    ('CI/CD', 'Hard Skill', 'Continuous Integration dan Continuous Deployment', 'GitMerge'),
    
    -- AI/ML
    ('Machine Learning', 'Hard Skill', 'Membangun model prediktif dengan data', 'Brain'),
    ('TensorFlow', 'Hard Skill', 'Framework machine learning dari Google', 'Cpu'),
    ('Natural Language Processing', 'Hard Skill', 'Pemrosesan dan analisis bahasa alami', 'MessageSquare'),
    
    -- Design & Creative
    ('After Effects', 'Hard Skill', 'Software motion graphics dan visual effects', 'Play'),
    ('Premiere Pro', 'Hard Skill', 'Software editing video profesional', 'Film'),
    ('Blender', 'Hard Skill', 'Software 3D modeling dan animation open-source', 'Box'),
    ('Design Thinking', 'Hard Skill', 'Metodologi problem-solving kreatif', 'Lightbulb'),
    
    -- Business
    ('Business Model Canvas', 'Hard Skill', 'Framework untuk strategi bisnis', 'Layout'),
    ('Market Research', 'Hard Skill', 'Riset pasar dan analisis kompetitor', 'Search'),
    ('Financial Modeling', 'Hard Skill', 'Membuat proyeksi keuangan dan valuasi', 'Calculator'),
    ('Pitching', 'Hard Skill', 'Mempresentasikan ide bisnis ke investor', 'Presentation'),
    
    -- Soft Skills tambahan
    ('Public Speaking', 'Soft Skill', 'Berbicara dengan percaya diri di depan audiens', 'Mic'),
    ('Conflict Resolution', 'Soft Skill', 'Menyelesaikan konflik secara konstruktif', 'Scale'),
    ('Mentoring', 'Soft Skill', 'Membimbing dan mengembangkan orang lain', 'Users'),
    ('Self-Learning', 'Soft Skill', 'Kemampuan belajar mandiri secara efektif', 'BookOpen'),
    ('Resilience', 'Soft Skill', 'Ketahanan menghadapi kegagalan dan tekanan', 'Shield')

ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 5. SEED COURSES (Learning Resources)
-- ============================================

-- Get skill IDs for courses
DO $$
DECLARE
    skill_js UUID;
    skill_react UUID;
    skill_python UUID;
    skill_figma UUID;
    skill_sql UUID;
    skill_git UUID;
    skill_ml UUID;
    skill_seo UUID;
BEGIN
    SELECT id INTO skill_js FROM public.skills WHERE name = 'JavaScript' LIMIT 1;
    SELECT id INTO skill_react FROM public.skills WHERE name = 'React' LIMIT 1;
    SELECT id INTO skill_python FROM public.skills WHERE name = 'Python' LIMIT 1;
    SELECT id INTO skill_figma FROM public.skills WHERE name = 'Figma' LIMIT 1;
    SELECT id INTO skill_sql FROM public.skills WHERE name = 'SQL' LIMIT 1;
    SELECT id INTO skill_git FROM public.skills WHERE name = 'Git' LIMIT 1;
    SELECT id INTO skill_ml FROM public.skills WHERE name = 'Machine Learning' LIMIT 1;
    SELECT id INTO skill_seo FROM public.skills WHERE name = 'SEO' LIMIT 1;

    -- Insert courses
    INSERT INTO public.courses (title, description, provider, url, duration_hours, difficulty, is_free, rating, skill_id, is_featured)
    VALUES
        -- JavaScript Courses
        ('JavaScript untuk Pemula', 'Belajar dasar-dasar JavaScript dari nol hingga mahir', 'freeCodeCamp', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', 300, 'Beginner', true, 4.8, skill_js, true),
        ('JavaScript Modern ES6+', 'Pelajari fitur-fitur terbaru JavaScript modern', 'YouTube - Web Programming UNPAS', 'https://www.youtube.com/playlist?list=PLFIM0718LjIWXagluzROrA-iBY9eeUt4w', 15, 'Intermediate', true, 4.9, skill_js, false),
        
        -- React Courses
        ('React.js Fundamentals', 'Panduan lengkap belajar React dari dasar', 'Dicoding', 'https://www.dicoding.com/academies/403', 40, 'Beginner', false, 4.7, skill_react, true),
        ('Full React Course 2024', 'Kursus React lengkap dengan project real-world', 'YouTube - Traversy Media', 'https://www.youtube.com/watch?v=LDB4uaJ87e0', 8, 'Intermediate', true, 4.6, skill_react, false),
        
        -- Python Courses
        ('Python untuk Pemula', 'Belajar Python dari nol untuk data science dan web', 'Coursera', 'https://www.coursera.org/specializations/python', 120, 'Beginner', true, 4.8, skill_python, true),
        ('Python Data Science', 'Analisis data dengan Python, Pandas, dan NumPy', 'DataCamp', 'https://www.datacamp.com/tracks/data-scientist-with-python', 80, 'Intermediate', false, 4.5, skill_python, false),
        
        -- Figma Courses
        ('Figma UI Design Mastery', 'Kuasai Figma untuk desain UI profesional', 'YouTube - DesignCourse', 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', 4, 'Beginner', true, 4.7, skill_figma, true),
        ('Advanced Figma Prototyping', 'Buat prototype interaktif tingkat lanjut', 'Udemy', 'https://www.udemy.com/course/figma-ui/', 12, 'Advanced', false, 4.6, skill_figma, false),
        
        -- SQL Courses
        ('SQL untuk Analisis Data', 'Belajar SQL dari dasar hingga query kompleks', 'YouTube - Programming with Mosh', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', 3, 'Beginner', true, 4.8, skill_sql, true),
        ('SQL Advanced Analytics', 'Teknik SQL lanjutan untuk business intelligence', 'Mode Analytics', 'https://mode.com/sql-tutorial/', 20, 'Advanced', true, 4.5, skill_sql, false),
        
        -- Git Courses
        ('Git & GitHub Crash Course', 'Pelajari version control dengan Git dan GitHub', 'YouTube - Traversy Media', 'https://www.youtube.com/watch?v=SWYqp7iY_Tc', 2, 'Beginner', true, 4.9, skill_git, true),
        
        -- Machine Learning
        ('Machine Learning Crash Course', 'Pengenalan ML dari Google', 'Google Developers', 'https://developers.google.com/machine-learning/crash-course', 15, 'Beginner', true, 4.7, skill_ml, true),
        ('Deep Learning Specialization', 'Kursus deep learning lengkap dari Andrew Ng', 'Coursera', 'https://www.coursera.org/specializations/deep-learning', 120, 'Advanced', false, 4.9, skill_ml, false),
        
        -- SEO Courses
        ('SEO Fundamentals', 'Dasar-dasar Search Engine Optimization', 'Semrush Academy', 'https://www.semrush.com/academy/courses/seo-fundamentals-course/', 4, 'Beginner', true, 4.6, skill_seo, true),
        ('Technical SEO Complete Guide', 'SEO teknis untuk developer dan marketer', 'Ahrefs Academy', 'https://ahrefs.com/academy/seo-training-course', 8, 'Intermediate', true, 4.7, skill_seo, false)
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- 6. LINK MORE CAREER-SKILLS
-- ============================================

-- Mobile Developer Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Mobile Developer' AND s.name IN ('React Native', 'JavaScript', 'TypeScript', 'Git')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Mobile Developer' AND s.name IN ('Flutter', 'Problem Solving', 'Teamwork')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- AI/ML Engineer Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'AI/ML Engineer' AND s.name IN ('Python', 'Machine Learning', 'TensorFlow', 'SQL')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'AI/ML Engineer' AND s.name IN ('Natural Language Processing', 'Data Analysis', 'Critical Thinking')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Fullstack Developer Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Fullstack Developer' AND s.name IN ('JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Fullstack Developer' AND s.name IN ('Next.js', 'Docker', 'Problem Solving', 'Communication')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Graphic Designer Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Graphic Designer' AND s.name IN ('Adobe Photoshop', 'Adobe Illustrator', 'Figma')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Graphic Designer' AND s.name IN ('Creativity', 'Communication', 'Design Thinking')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Social Media Manager Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Social Media Manager' AND s.name IN ('Social Media Marketing', 'Content Marketing', 'Copywriting')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Social Media Manager' AND s.name IN ('Google Analytics', 'Creativity', 'Communication', 'Video Editing')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- ============================================
-- 7. UPDATE TRIGGERS
-- ============================================

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_courses_updated_at
    BEFORE UPDATE ON public.user_courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- EXPANDED SEED DATA COMPLETE!
-- Total: 26 Careers, 62 Skills, 15 Courses
-- ============================================

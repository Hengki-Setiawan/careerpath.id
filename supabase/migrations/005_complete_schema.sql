-- Migration: 005_complete_schema.sql
-- Complete database schema for CareerPath.id
-- Run this after 004_expanded_seed.sql

-- ============================================
-- JOBS & APPLICATIONS DOMAIN
-- ============================================

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    company_logo TEXT,
    location VARCHAR(100),
    job_type VARCHAR(50) DEFAULT 'full-time', -- full-time, part-time, internship, contract, remote
    salary_min BIGINT,
    salary_max BIGINT,
    description TEXT,
    requirements TEXT[],
    skills_required TEXT[],
    skills_preferred TEXT[],
    experience_years INTEGER DEFAULT 0,
    career_path_id UUID REFERENCES careers(id),
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    external_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications tracking
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied', -- applied, reviewing, interview, offered, rejected, withdrawn
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    match_score INTEGER,
    notes TEXT,
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_notes TEXT,
    offer_amount BIGINT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Saved jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- ============================================
-- PORTFOLIO DOMAIN
-- ============================================

-- User portfolios
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    public_url VARCHAR(100) UNIQUE,
    headline TEXT,
    bio TEXT,
    is_public BOOLEAN DEFAULT false,
    portfolio_score INTEGER DEFAULT 0,
    theme VARCHAR(50) DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack TEXT[],
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    credential_url TEXT,
    image_url TEXT,
    skill_tags TEXT[],
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MOOD & MENTAL HEALTH DOMAIN
-- ============================================

-- Mood entries (daily check-in)
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
    entry_date DATE DEFAULT CURRENT_DATE,
    quick_note TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, entry_date)
);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
    content TEXT NOT NULL,
    tags TEXT[],
    sentiment_score DECIMAL(3,2), -- AI-generated sentiment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mental health alerts (AI-triggered)
CREATE TABLE IF NOT EXISTS mental_health_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50), -- low_mood_streak, anxiety_detected, burnout_risk
    severity VARCHAR(20), -- low, medium, high
    message TEXT,
    is_acknowledged BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONSULTATION DOMAIN
-- ============================================

-- Professionals (Psikolog, Career Counselor, Mentor)
CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    type VARCHAR(50) NOT NULL, -- psikolog, counselor, mentor
    specializations TEXT[],
    bio TEXT,
    avatar_url TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    price_per_session BIGINT,
    available_slots JSONB, -- {"monday": ["09:00", "10:00"], ...}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation bookings
CREATE TABLE IF NOT EXISTS consultation_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    session_type VARCHAR(50) DEFAULT 'video', -- video, voice, chat
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded
    payment_amount BIGINT,
    meeting_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session notes (after consultation)
CREATE TABLE IF NOT EXISTS session_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES consultation_bookings(id) ON DELETE CASCADE,
    summary TEXT,
    action_items TEXT[],
    follow_up_date DATE,
    is_visible_to_user BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EVALUATION & TARGETS DOMAIN
-- ============================================

-- Monthly targets
CREATE TABLE IF NOT EXISTS monthly_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month DATE NOT NULL, -- First day of month
    learning_target INTEGER DEFAULT 3, -- Courses to complete
    job_apply_target INTEGER DEFAULT 8, -- Jobs to apply
    portfolio_target INTEGER DEFAULT 1, -- Projects to add
    mood_checkin_target INTEGER DEFAULT 20, -- Days to check-in
    custom_targets JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- Monthly evaluations
CREATE TABLE IF NOT EXISTS monthly_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    overall_score INTEGER, -- 0-100
    grade VARCHAR(2), -- S, A, B, C, D
    learning_score INTEGER,
    job_score INTEGER,
    portfolio_score INTEGER,
    wellness_score INTEGER,
    ai_insights TEXT,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- User achievements/badges
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(255),
    achievement_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- COMMUNITY DOMAIN
-- ============================================

-- Community posts
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100), -- success_story, tips, job_market, mental_health, question
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post likes
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES post_comments(id),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER SETTINGS & NOTIFICATIONS
-- ============================================

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_digest BOOLEAN DEFAULT true,
    job_alerts BOOLEAN DEFAULT true,
    learning_reminder BOOLEAN DEFAULT true,
    mood_checkin_reminder BOOLEAN DEFAULT false,
    evaluation_reminder BOOLEAN DEFAULT true,
    public_portfolio BOOLEAN DEFAULT false,
    show_progress_community BOOLEAN DEFAULT true,
    analytics_enabled BOOLEAN DEFAULT true,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'id',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- job_match, course_reminder, evaluation_due, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LEARNING PROGRESS DOMAIN (Extended)
-- ============================================

-- Learning roadmap steps
CREATE TABLE IF NOT EXISTS roadmap_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_path_id UUID REFERENCES careers(id),
    step_order INTEGER NOT NULL,
    month_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    skills TEXT[],
    status VARCHAR(50) DEFAULT 'locked', -- locked, current, completed
    milestone_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roadmap step courses
CREATE TABLE IF NOT EXISTS roadmap_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_step_id UUID REFERENCES roadmap_steps(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    is_required BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_job_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_user ON portfolio_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_courses ENABLE ROW LEVEL SECURITY;

-- Standard user policies (users can read/write their own data)
CREATE POLICY "Users can view own data" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own data" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON job_applications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own data" ON mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own data" ON mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own data" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own data" ON portfolios FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public portfolios visible" ON portfolios FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own data" ON portfolio_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own data" ON portfolio_projects FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view jobs" ON jobs FOR SELECT USING (is_active = true);

CREATE POLICY "Everyone can view posts" ON community_posts FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA FOR PROFESSIONALS
-- ============================================

INSERT INTO professionals (name, title, type, specializations, bio, rating, review_count, price_per_session) VALUES
('Dr. Siti Aminah, M.Psi', 'Psikolog Klinis', 'psikolog', ARRAY['Anxiety', 'Stress Kerja', 'Quarter-life Crisis'], 'Psikolog klinis berpengalaman 10 tahun menangani young professionals', 4.9, 128, 150000),
('Andi Prasetyo, M.A.', 'Career Counselor', 'counselor', ARRAY['Career Planning', 'Interview Preparation', 'Resume Review'], 'Mantan HR Manager dengan passion membantu fresh graduates', 4.8, 95, 120000),
('Rini Wulandari', 'Industry Mentor', 'mentor', ARRAY['Data Science', 'Analytics', 'Tech Industry'], 'Senior Data Scientist di perusahaan tech multinasional', 5.0, 45, 200000),
('Dr. Ahmad Fauzi, M.Psi', 'Psikolog', 'psikolog', ARRAY['Career Anxiety', 'Work-Life Balance', 'Burnout'], 'Spesialis kesehatan mental di tempat kerja', 4.7, 87, 150000),
('Maya Sari, MBA', 'Career Counselor', 'counselor', ARRAY['Startup Careers', 'Personal Branding', 'Networking'], 'Founder startup HR tech, berpengalaman 8 tahun', 4.9, 112, 150000)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA FOR SAMPLE JOBS
-- ============================================

INSERT INTO jobs (title, company, location, job_type, salary_min, salary_max, skills_required, skills_preferred, experience_years, description) VALUES
('Data Analyst', 'PT Telkom Indonesia', 'Makassar', 'full-time', 7000000, 10000000, ARRAY['SQL', 'Python', 'Excel', 'Data Visualization'], ARRAY['Tableau', 'Power BI'], 1, 'Menganalisis data pelanggan untuk insight bisnis'),
('Junior Software Engineer', 'Gojek', 'Remote', 'full-time', 8000000, 14000000, ARRAY['JavaScript', 'React', 'Node.js', 'Git'], ARRAY['TypeScript', 'GraphQL'], 0, 'Membangun fitur baru untuk aplikasi consumer'),
('UI/UX Designer', 'Tokopedia', 'Jakarta', 'full-time', 6000000, 12000000, ARRAY['Figma', 'User Research', 'Prototyping'], ARRAY['Motion Design', 'HTML/CSS'], 1, 'Merancang pengalaman pengguna yang delightful'),
('Digital Marketing Intern', 'Bukalapak', 'Remote', 'internship', 2000000, 3000000, ARRAY['Social Media', 'Content Writing', 'Analytics'], ARRAY['SEO', 'Google Ads'], 0, 'Support tim marketing dalam campaign digital'),
('Business Analyst', 'Bank Mandiri', 'Makassar', 'full-time', 8000000, 14000000, ARRAY['Excel', 'SQL', 'Communication', 'Documentation'], ARRAY['Python', 'Power BI'], 2, 'Analisis kebutuhan bisnis untuk pengembangan sistem'),
('Frontend Developer', 'Traveloka', 'Jakarta', 'full-time', 10000000, 18000000, ARRAY['JavaScript', 'React', 'CSS', 'HTML', 'Git'], ARRAY['Next.js', 'TypeScript'], 2, 'Membangun antarmuka web yang responsif')
ON CONFLICT DO NOTHING;

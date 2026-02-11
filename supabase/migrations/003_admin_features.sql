-- Migration: Add admin role and audit logging
-- Run this in Supabase SQL Editor

-- 1. Create role enum type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add role column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- 3. Create admin_audit_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL, -- 'user', 'career', 'skill', 'setting'
    target_id UUID,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create site_settings table for website configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'warning', 'success', 'error')) DEFAULT 'info',
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_id UUID REFERENCES public.users(id),
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create page_contents table for editable static pages
CREATE TABLE IF NOT EXISTS public.page_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT NOT NULL UNIQUE, -- 'about', 'features', 'privacy', 'terms'
    title TEXT NOT NULL,
    content JSONB NOT NULL, -- Flexible content structure
    meta_title TEXT,
    meta_description TEXT,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'read', 'replied', 'archived')) DEFAULT 'new',
    replied_by UUID REFERENCES public.users(id),
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Enable RLS on new tables
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 10. Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. RLS Policies for admin tables

-- Admin audit logs (only admins can view)
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs
    FOR SELECT USING (public.is_admin());
CREATE POLICY "System inserts audit logs" ON public.admin_audit_logs
    FOR INSERT WITH CHECK (true);

-- Site settings (admins can manage)
CREATE POLICY "Anyone can view site settings" ON public.site_settings
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings
    FOR ALL USING (public.is_admin());

-- Announcements (public view, admin manage)
CREATE POLICY "Anyone can view active announcements" ON public.announcements
    FOR SELECT USING (is_active = true AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at > NOW()));
CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL USING (public.is_admin());

-- Blog posts (public view published, admin manage all)
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage all posts" ON public.blog_posts
    FOR ALL USING (public.is_admin());

-- Page contents (public view, admin manage)
CREATE POLICY "Anyone can view page contents" ON public.page_contents
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage page contents" ON public.page_contents
    FOR ALL USING (public.is_admin());

-- Contact messages (admin only)
CREATE POLICY "Admins can view contact messages" ON public.contact_messages
    FOR SELECT USING (public.is_admin());
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update contact messages" ON public.contact_messages
    FOR UPDATE USING (public.is_admin());

-- 13. Update users table RLS for admin access
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.is_admin() OR auth.uid() = id);
CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (public.is_super_admin() OR auth.uid() = id);

-- 14. Insert default page contents
INSERT INTO public.page_contents (page_key, title, content) VALUES
('about', 'Tentang Kami', '{"hero": {"title": "Tentang CareerPath.id", "subtitle": "Platform Career Guidance & Mental Health untuk Mahasiswa Indonesia"}, "mission": {"title": "Misi Kami", "content": "Membantu mahasiswa Indonesia menemukan karier impian mereka dengan dukungan teknologi AI dan perhatian pada kesehatan mental."}, "team": [{"name": "Tim CareerPath.id", "role": "Developer Team", "bio": "Kami adalah tim yang berdedikasi untuk membantu mahasiswa Indonesia."}]}'),
('features', 'Fitur', '{"hero": {"title": "Fitur CareerPath.id", "subtitle": "Semua yang kamu butuhkan untuk perjalanan kariermu"}, "features": [{"title": "Skill Gap Analysis", "description": "Analisis kesenjangan skill antara kemampuanmu saat ini dengan karier impian", "icon": "chart"}, {"title": "AI Career Mentor", "description": "Konsultasi karier dengan AI yang memahami kebutuhanmu", "icon": "brain"}, {"title": "Mental Health Check", "description": "Pantau kesehatan mentalmu dengan tes GAD-7 terstandar", "icon": "heart"}]}'),
('privacy', 'Kebijakan Privasi', '{"title": "Kebijakan Privasi", "lastUpdated": "2024-01-01", "sections": [{"title": "Pengumpulan Data", "content": "Kami mengumpulkan data yang diperlukan untuk menyediakan layanan terbaik."}, {"title": "Penggunaan Data", "content": "Data kamu hanya digunakan untuk keperluan platform CareerPath.id."}, {"title": "Keamanan Data", "content": "Kami menggunakan enkripsi dan praktik keamanan terbaik untuk melindungi datamu."}]}'),
('terms', 'Syarat & Ketentuan', '{"title": "Syarat & Ketentuan", "lastUpdated": "2024-01-01", "sections": [{"title": "Penggunaan Layanan", "content": "Dengan menggunakan CareerPath.id, kamu menyetujui syarat dan ketentuan ini."}, {"title": "Akun Pengguna", "content": "Kamu bertanggung jawab menjaga keamanan akun dan passwordmu."}, {"title": "Konten", "content": "Semua konten di platform ini adalah milik CareerPath.id kecuali dinyatakan lain."}]}')
ON CONFLICT (page_key) DO NOTHING;

-- 15. Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', '"CareerPath.id"', 'Nama website'),
('site_description', '"Platform Career Guidance & Mental Health"', 'Deskripsi website'),
('maintenance_mode', 'false', 'Mode maintenance'),
('allow_registration', 'true', 'Izinkan pendaftaran baru'),
('groq_model', '"llama-3.3-70b-versatile"', 'Model Groq AI yang digunakan')
ON CONFLICT (key) DO NOTHING;

-- 16. Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_contents_updated_at BEFORE UPDATE ON public.page_contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Done! Run this migration in Supabase SQL Editor

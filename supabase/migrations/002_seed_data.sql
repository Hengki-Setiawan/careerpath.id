-- ============================================
-- CareerPath.id Seed Data
-- Description: Sample data for development and testing
-- ============================================

-- ============================================
-- 1. SEED CAREERS (Katalog Pekerjaan)
-- ============================================

INSERT INTO public.careers (title, description, salary_range_min, salary_range_max, industry, job_type, experience_level, demand_level, growth_outlook, icon_name, color)
VALUES
    -- Tech Careers
    ('UI/UX Designer', 'Merancang antarmuka pengguna yang intuitif dan pengalaman pengguna yang menyenangkan untuk produk digital.', 6000, 25000, 'Technology', 'Full-time', 'Entry Level', 'Very High', 'Pertumbuhan 22% dalam 5 tahun ke depan', 'Palette', 'violet'),
    ('Frontend Developer', 'Membangun tampilan website dan aplikasi menggunakan HTML, CSS, JavaScript, dan framework modern.', 7000, 30000, 'Technology', 'Full-time', 'Entry Level', 'Very High', 'Demand tinggi untuk React dan Next.js developers', 'Code', 'blue'),
    ('Backend Developer', 'Mengembangkan server, database, dan API untuk mendukung aplikasi.', 8000, 35000, 'Technology', 'Full-time', 'Mid Level', 'High', 'Node.js dan Python semakin populer', 'Server', 'green'),
    ('Data Analyst', 'Menganalisis data untuk menemukan insights dan mendukung keputusan bisnis.', 7000, 28000, 'Technology', 'Full-time', 'Entry Level', 'Very High', 'Big Data semakin penting di semua industri', 'BarChart3', 'cyan'),
    ('Product Manager', 'Mengelola roadmap produk dan koordinasi antara tim teknis dan bisnis.', 12000, 45000, 'Technology', 'Full-time', 'Mid Level', 'High', 'Startup ecosystem berkembang pesat', 'Rocket', 'orange'),
    ('DevOps Engineer', 'Mengelola infrastruktur, CI/CD, dan memastikan aplikasi berjalan lancar.', 10000, 40000, 'Technology', 'Full-time', 'Mid Level', 'High', 'Cloud computing terus berkembang', 'Cloud', 'slate'),
    
    -- Creative Careers
    ('Graphic Designer', 'Membuat desain visual untuk branding, marketing, dan media sosial.', 4000, 18000, 'Creative', 'Full-time', 'Entry Level', 'High', 'Visual content semakin penting', 'Brush', 'pink'),
    ('Content Writer', 'Menulis konten untuk website, blog, dan media sosial.', 4000, 15000, 'Creative', 'Freelance', 'Entry Level', 'High', 'Content marketing terus berkembang', 'PenTool', 'amber'),
    ('Video Editor', 'Mengedit dan memproduksi konten video untuk berbagai platform.', 5000, 20000, 'Creative', 'Freelance', 'Entry Level', 'Very High', 'Video content dominasi di semua platform', 'Video', 'red'),
    ('Social Media Manager', 'Mengelola strategi dan konten media sosial untuk brand.', 5000, 18000, 'Creative', 'Full-time', 'Entry Level', 'Very High', 'Digital presence wajib untuk semua bisnis', 'Share2', 'indigo'),
    
    -- Business Careers
    ('Digital Marketer', 'Merencanakan dan mengeksekusi strategi pemasaran digital.', 6000, 25000, 'Business', 'Full-time', 'Entry Level', 'Very High', 'Digital marketing essential untuk semua bisnis', 'TrendingUp', 'emerald'),
    ('Business Development', 'Mencari peluang bisnis baru dan membangun kemitraan strategis.', 8000, 35000, 'Business', 'Full-time', 'Mid Level', 'High', 'Startup dan SME butuh BD yang kuat', 'Handshake', 'yellow'),
    ('Financial Analyst', 'Menganalisis data keuangan dan memberikan rekomendasi investasi.', 8000, 35000, 'Finance', 'Full-time', 'Entry Level', 'High', 'Fintech growing rapidly', 'Calculator', 'teal'),
    ('HR Specialist', 'Mengelola rekrutmen, pengembangan karyawan, dan budaya perusahaan.', 6000, 22000, 'Business', 'Full-time', 'Entry Level', 'Medium', 'People management semakin penting', 'Users', 'rose'),
    
    -- Healthcare & Education
    ('Health Educator', 'Mengembangkan program edukasi kesehatan untuk masyarakat.', 5000, 15000, 'Healthcare', 'Full-time', 'Entry Level', 'Medium', 'Awareness kesehatan mental meningkat', 'Heart', 'red'),
    ('Online Tutor', 'Mengajar berbagai mata pelajaran secara online.', 3000, 12000, 'Education', 'Part-time', 'Entry Level', 'High', 'E-learning terus berkembang', 'GraduationCap', 'purple')

ON CONFLICT (title) DO NOTHING;

-- ============================================
-- 2. SEED SKILLS (Bank Kompetensi)
-- ============================================

INSERT INTO public.skills (name, category, description, icon_name)
VALUES
    -- Hard Skills - Programming
    ('JavaScript', 'Hard Skill', 'Bahasa pemrograman untuk web development', 'Code'),
    ('TypeScript', 'Hard Skill', 'JavaScript dengan static typing', 'FileCode'),
    ('React', 'Hard Skill', 'Library JavaScript untuk membangun UI', 'Atom'),
    ('Next.js', 'Hard Skill', 'Framework React untuk production', 'Layers'),
    ('Node.js', 'Hard Skill', 'Runtime JavaScript untuk backend', 'Server'),
    ('Python', 'Hard Skill', 'Bahasa pemrograman serbaguna', 'Terminal'),
    ('SQL', 'Hard Skill', 'Query language untuk database', 'Database'),
    ('Git', 'Hard Skill', 'Version control system', 'GitBranch'),
    
    -- Hard Skills - Design
    ('Figma', 'Hard Skill', 'Tool desain UI/UX modern', 'Figma'),
    ('Adobe Photoshop', 'Hard Skill', 'Software editing foto dan grafis', 'Image'),
    ('Adobe Illustrator', 'Hard Skill', 'Software untuk vector graphics', 'PenTool'),
    ('UI Design', 'Hard Skill', 'Merancang antarmuka pengguna', 'Layout'),
    ('UX Research', 'Hard Skill', 'Riset pengalaman pengguna', 'Search'),
    ('Prototyping', 'Hard Skill', 'Membuat prototype interaktif', 'MousePointer'),
    
    -- Hard Skills - Data & Analytics
    ('Data Analysis', 'Hard Skill', 'Menganalisis dan interpretasi data', 'BarChart'),
    ('Excel Advanced', 'Hard Skill', 'Spreadsheet untuk analisis data', 'Table'),
    ('Power BI', 'Hard Skill', 'Tool visualisasi data', 'PieChart'),
    ('Google Analytics', 'Hard Skill', 'Analisis traffic website', 'Activity'),
    
    -- Hard Skills - Marketing
    ('SEO', 'Hard Skill', 'Search Engine Optimization', 'Search'),
    ('Google Ads', 'Hard Skill', 'Platform iklan Google', 'Target'),
    ('Social Media Marketing', 'Hard Skill', 'Pemasaran di media sosial', 'Share'),
    ('Content Marketing', 'Hard Skill', 'Strategi konten untuk marketing', 'FileText'),
    ('Email Marketing', 'Hard Skill', 'Pemasaran melalui email', 'Mail'),
    
    -- Hard Skills - Other
    ('Video Editing', 'Hard Skill', 'Mengedit video dengan software profesional', 'Video'),
    ('Copywriting', 'Hard Skill', 'Menulis copy yang persuasif', 'Edit'),
    ('Project Management', 'Hard Skill', 'Mengelola proyek dan timeline', 'Kanban'),
    
    -- Soft Skills
    ('Communication', 'Soft Skill', 'Kemampuan berkomunikasi efektif', 'MessageCircle'),
    ('Critical Thinking', 'Soft Skill', 'Berpikir kritis dan analitis', 'Brain'),
    ('Problem Solving', 'Soft Skill', 'Memecahkan masalah dengan kreatif', 'Lightbulb'),
    ('Teamwork', 'Soft Skill', 'Bekerja sama dalam tim', 'Users'),
    ('Leadership', 'Soft Skill', 'Memimpin dan menginspirasi tim', 'Crown'),
    ('Time Management', 'Soft Skill', 'Mengelola waktu dengan efektif', 'Clock'),
    ('Adaptability', 'Soft Skill', 'Kemampuan beradaptasi dengan perubahan', 'RefreshCw'),
    ('Creativity', 'Soft Skill', 'Berpikir kreatif dan inovatif', 'Sparkles'),
    ('Emotional Intelligence', 'Soft Skill', 'Memahami dan mengelola emosi', 'Heart'),
    ('Presentation Skills', 'Soft Skill', 'Mempresentasikan ide dengan baik', 'Presentation'),
    ('Negotiation', 'Soft Skill', 'Kemampuan bernegosiasi', 'Handshake'),
    ('Networking', 'Soft Skill', 'Membangun relasi profesional', 'Network')

ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 3. SEED CAREER_SKILLS (Relasi Karier-Skill)
-- ============================================

-- UI/UX Designer Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'UI/UX Designer' AND s.name IN ('Figma', 'UI Design', 'UX Research', 'Prototyping')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'UI/UX Designer' AND s.name IN ('Communication', 'Creativity', 'Critical Thinking', 'Adobe Photoshop')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Frontend Developer Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Frontend Developer' AND s.name IN ('JavaScript', 'TypeScript', 'React', 'Next.js', 'Git')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Frontend Developer' AND s.name IN ('Problem Solving', 'Communication', 'Teamwork')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Backend Developer Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Backend Developer' AND s.name IN ('Node.js', 'Python', 'SQL', 'Git')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Backend Developer' AND s.name IN ('Problem Solving', 'Critical Thinking')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Data Analyst Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Data Analyst' AND s.name IN ('Data Analysis', 'SQL', 'Excel Advanced', 'Power BI')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Data Analyst' AND s.name IN ('Python', 'Critical Thinking', 'Presentation Skills', 'Communication')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Digital Marketer Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Digital Marketer' AND s.name IN ('SEO', 'Google Ads', 'Social Media Marketing', 'Google Analytics')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Digital Marketer' AND s.name IN ('Content Marketing', 'Email Marketing', 'Creativity', 'Data Analysis')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- Product Manager Skills
INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Essential'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Product Manager' AND s.name IN ('Communication', 'Project Management', 'Critical Thinking', 'Leadership')
ON CONFLICT (career_id, skill_id) DO NOTHING;

INSERT INTO public.career_skills (career_id, skill_id, importance)
SELECT c.id, s.id, 'Important'::skill_importance
FROM public.careers c, public.skills s
WHERE c.title = 'Product Manager' AND s.name IN ('Data Analysis', 'UX Research', 'Presentation Skills', 'Negotiation')
ON CONFLICT (career_id, skill_id) DO NOTHING;

-- ============================================
-- SEED DATA COMPLETE!
-- ============================================

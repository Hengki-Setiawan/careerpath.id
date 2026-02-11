-- Ganti 'YOUR_USER_ID_HERE' dengan UID kamu
-- Kamu bisa mendapatkan UID dari menu Authentication -> Users di dashboard Supabase

UPDATE public.users
SET role = 'super_admin'
WHERE id = 'YOUR_USER_ID_HERE';

-- Verifikasi perubahan
SELECT * FROM public.users WHERE id = 'YOUR_USER_ID_HERE';

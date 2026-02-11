-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications (mark as read)"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Only system/admin can insert notifications (for now, or maybe triggers)
-- For now allow authenticated users to insert (e.g. from client side actions if needed, but better restricted)
-- Actually, better restrict insert to service_role or functions.
-- But for simplicity in prototypes, we might allow it or use server-side API.
-- Let's stick to server-side API for insertion, so no RLS for insert needed for public/authenticated users.

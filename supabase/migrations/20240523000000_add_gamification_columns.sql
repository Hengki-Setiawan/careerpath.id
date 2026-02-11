-- Migration: Add Gamification Columns to Users Table
-- Description: Adds total_xp, current_level, current_streak, and last_activity_at columns.

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a function to calculate level based on XP
-- Formula: Level = floor(sqrt(XP / 100))
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF xp < 100 THEN
    RETURN 1;
  ELSE
    RETURN floor(sqrt(xp / 100));
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update level automatically when XP changes
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.current_level := calculate_level(NEW.total_xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_xp_change
BEFORE UPDATE OF total_xp ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_user_level();

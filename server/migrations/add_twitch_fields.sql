-- Twitch Integration Migration
-- Add Twitch-related fields to users table

-- Add Twitch OAuth token fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS "twitchAccessToken" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "twitchRefreshToken" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "twitchTokenExpiresAt" TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "twitchId" VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS "twitchUsername" VARCHAR(255);

-- Add Twitch trigger state tracking (JSONB for flexible stream status storage)
ALTER TABLE users ADD COLUMN IF NOT EXISTS "twitchStreamLastStatus" JSONB DEFAULT '{}';

-- Optional: Add indices for better query performance
CREATE INDEX IF NOT EXISTS idx_users_twitch_id ON users("twitchId");
CREATE INDEX IF NOT EXISTS idx_users_twitch_username ON users("twitchUsername");

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'users' 
    AND column_name LIKE 'twitch%'
ORDER BY 
    column_name;

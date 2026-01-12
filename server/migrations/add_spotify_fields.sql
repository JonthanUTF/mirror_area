-- Spotify Integration Migration
-- Add Spotify-related fields to users table

-- Add Spotify OAuth token fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS "spotifyAccessToken" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "spotifyRefreshToken" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "spotifyTokenExpiresAt" TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "spotifyUserId" VARCHAR(255);

-- Add Spotify trigger state tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS "spotifyLastSavedTrackId" VARCHAR(255);

-- Optional: Add indices for better query performance
CREATE INDEX IF NOT EXISTS idx_users_spotify_user_id ON users("spotifyUserId");
CREATE INDEX IF NOT EXISTS idx_users_spotify_token_expires ON users("spotifyTokenExpiresAt");

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'users' 
    AND column_name LIKE 'spotify%'
ORDER BY 
    column_name;

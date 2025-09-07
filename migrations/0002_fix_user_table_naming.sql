-- Migration to fix any existing "user" table and ensure it's renamed to "users"
-- This migration addresses the PostgreSQL error: "relation 'user' does not exist"

-- First, check if there's a table named "user" and rename it to "users" if it exists
-- This handles the case where someone might have created a "user" table manually

DO $$
BEGIN
    -- Check if 'user' table exists and 'users' table doesn't exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user' AND table_schema = 'public')
       AND NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        -- Rename 'user' table to 'users'
        ALTER TABLE "user" RENAME TO "users";
        RAISE NOTICE 'Renamed table "user" to "users" to fix PostgreSQL reserved keyword issue';
    END IF;
    
    -- If both tables exist, this is a more complex situation
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user' AND table_schema = 'public')
       AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        RAISE WARNING 'Both "user" and "users" tables exist. Manual intervention may be required.';
    END IF;
END $$;

-- Ensure the users table exists with correct structure
CREATE TABLE IF NOT EXISTS "users" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" varchar UNIQUE NOT NULL,
    "password" varchar NOT NULL,
    "first_name" varchar,
    "last_name" varchar,
    "profile_image_url" varchar,
    "role" varchar DEFAULT 'patient',
    "level" integer DEFAULT 1,
    "points" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- If there was a 'user' table that got renamed, we may need to update any foreign key constraints
-- This is a safety measure to ensure all references point to 'users'
DO $$
BEGIN
    -- Update any foreign key constraints that might reference the old 'user' table
    -- Note: This is mainly preventive as our migrations should already be correct
    NULL; -- Placeholder - actual FK updates would go here if needed
END $$;
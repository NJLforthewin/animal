-- Migration: Add email verification to users table
ALTER TABLE user 
ADD COLUMN email VARCHAR(100) NOT NULL UNIQUE,
ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN verification_code VARCHAR(10);

-- Migration: Add blind_full_name and blind_age to user table
ALTER TABLE user ADD COLUMN blind_full_name VARCHAR(100) AFTER name;
ALTER TABLE user ADD COLUMN blind_age INT(3) AFTER blind_full_name;

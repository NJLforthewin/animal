-- Migration: Add POI columns to location_log
ALTER TABLE location_log
  ADD COLUMN poi_name VARCHAR(255) NULL,
  ADD COLUMN poi_type VARCHAR(100) NULL,
  ADD COLUMN poi_distance FLOAT NULL;

-- You may need to update dashboard_location_latest and dashboard_latest views to include these columns.
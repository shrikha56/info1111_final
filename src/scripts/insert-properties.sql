-- SQL script to insert properties into the Supabase database
-- Run this in the Supabase SQL Editor

-- Insert properties
INSERT INTO properties (unit_number, address)
VALUES 
  ('101', '123 Sunset Blvd, Sydney, Unit 101'),
  ('102', '45 Harbour St, Sydney, Unit 102'),
  ('103', '78 Park Lane, Sydney, Unit 103');

-- Verify the inserted properties
SELECT * FROM properties;

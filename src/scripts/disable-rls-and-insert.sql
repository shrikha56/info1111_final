-- SQL script to disable RLS and insert properties
-- Run this in the Supabase SQL Editor

-- Disable Row Level Security for the properties table
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;

-- Insert properties
INSERT INTO properties (unit_number, address)
VALUES 
  ('101', '123 Sunset Blvd, Sydney, Unit 101'),
  ('102', '45 Harbour St, Sydney, Unit 102'),
  ('103', '78 Park Lane, Sydney, Unit 103');

-- Verify the inserted properties
SELECT * FROM properties;

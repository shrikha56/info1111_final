-- Create a stored procedure to insert maintenance requests
-- This bypasses RLS policies since it runs with definer's rights

CREATE OR REPLACE FUNCTION insert_maintenance_request(
  p_title TEXT,
  p_description TEXT,
  p_status TEXT DEFAULT 'pending',
  p_priority TEXT DEFAULT 'medium',
  p_category TEXT DEFAULT 'general',
  p_property_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::UUID,
  p_requester_id UUID DEFAULT '00000000-0000-0000-0000-000000000003'::UUID
) RETURNS JSONB
SECURITY DEFINER -- This makes it run with the privileges of the creator
SET search_path = public -- Prevent search path injection
AS $$
DECLARE
  new_id UUID;
  result JSONB;
BEGIN
  -- Insert the maintenance request
  INSERT INTO maintenance_requests (
    title,
    description,
    status,
    priority,
    category,
    property_id,
    requester_id,
    created_at
  ) VALUES (
    p_title,
    p_description,
    p_status,
    p_priority,
    p_category,
    p_property_id,
    p_requester_id,
    NOW()
  ) RETURNING id INTO new_id;
  
  -- Get the full record to return
  SELECT row_to_json(mr)::JSONB INTO result
  FROM (
    SELECT * FROM maintenance_requests WHERE id = new_id
  ) mr;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Disable RLS for the function
ALTER FUNCTION insert_maintenance_request SECURITY DEFINER;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION insert_maintenance_request TO anon;

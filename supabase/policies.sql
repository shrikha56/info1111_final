-- Add RLS policies for maintenance_requests table

-- Policy to allow all users to read maintenance requests
CREATE POLICY "Allow users to read maintenance requests"
ON maintenance_requests
FOR SELECT
USING (true);

-- Policy to allow anyone to insert maintenance requests (for demo purposes)
CREATE POLICY "Allow anyone to insert maintenance requests"
ON maintenance_requests
FOR INSERT
WITH CHECK (true);

-- Explicitly enable RLS but make it permissive for inserts
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests FORCE ROW LEVEL SECURITY;

-- Policy to allow users to update their own maintenance requests
CREATE POLICY "Allow users to update their own maintenance requests"
ON maintenance_requests
FOR UPDATE
USING (requester_id = auth.uid())
WITH CHECK (requester_id = auth.uid());

-- Policy to allow admins and managers to update any maintenance request
CREATE POLICY "Allow admins and managers to update any maintenance request"
ON maintenance_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'manager')
  )
);

-- Add RLS policies for maintenance_requests table

-- Policy to allow all users to read maintenance requests
CREATE POLICY "Allow users to read maintenance requests"
ON maintenance_requests
FOR SELECT
USING (true);

-- Policy to allow users to insert their own maintenance requests
CREATE POLICY "Allow users to insert maintenance requests"
ON maintenance_requests
FOR INSERT
WITH CHECK (true);

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

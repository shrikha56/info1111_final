import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  console.log('Testing Supabase connection...');
  try {
    // Skip health check and go directly to checking tables
    console.log('Checking Supabase tables...');
    
    // Check if our tables exist
    
    // Check if our tables exist
    const tables = ['users', 'buildings', 'properties', 'maintenance_requests', 'notifications', 'announcements'];
    const tableResults: Record<string, { exists: boolean; count?: number; error?: string }> = {};
    
    for (const table of tables) {
      console.log(`Checking table: ${table}`);
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          console.error(`Error checking table ${table}:`, JSON.stringify(error));
          tableResults[table] = { exists: false, error: error.message };
        } else {
          console.log(`Table ${table} exists`);
          tableResults[table] = { exists: true, count: data?.length || 0 };
        }
      } catch (tableError) {
        console.error(`Exception checking table ${table}:`, tableError);
        tableResults[table] = { exists: false, error: String(tableError) };
      }
    }
    
    // Try to fetch specific records from each table
    console.log('Fetching sample data from each table...');
    
    // Check users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .limit(3);
      
    // Check maintenance_requests table
    const { data: maintenanceData, error: maintenanceError } = await supabase
      .from('maintenance_requests')
      .select('id, title, description, status')
      .limit(3);
      
    // Check announcements table
    const { data: announcementData, error: announcementError } = await supabase
      .from('announcements')
      .select('id, title, content')
      .limit(3);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      tableStatus: tableResults,
      sampleData: {
        users: userData || [],
        maintenance: maintenanceData || [],
        announcements: announcementData || []
      },
      errors: {
        users: userError ? userError.message : null,
        maintenance: maintenanceError ? maintenanceError.message : null,
        announcements: announcementError ? announcementError.message : null
      }
    });
  } catch (error: unknown) {
    console.error('Supabase connection test failed:', error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    
    // Check if this is a schema-related error
    const errorStr = String(errorMessage).toLowerCase();
    const isSchemaError = errorStr.includes('schema') || errorStr.includes('relation') || errorStr.includes('table');
    
    return NextResponse.json({
      success: false,
      message: `Failed to connect to Supabase: ${errorMessage}`,
      error: errorMessage,
      possibleSolution: isSchemaError ? 
        "The database schema may not be applied correctly. You need to run the schema.sql file in the Supabase SQL editor." : 
        "Check your connection credentials and network connectivity."
    });
  }
}

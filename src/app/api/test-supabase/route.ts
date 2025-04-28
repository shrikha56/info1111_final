import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    // Test the connection by checking if we can access the database schema
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', JSON.stringify(error));
      throw new Error(`Connection error: ${error.message}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      data: data || [],
      tableExists: true
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
        "The database schema may not be applied. You need to run the schema.sql file in the Supabase SQL editor." : 
        "Check your connection credentials and network connectivity."
    });
  }
}

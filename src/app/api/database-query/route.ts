import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Define route segment config for static rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { table, query, limit = 10 } = body;
    
    if (!table) {
      return NextResponse.json({ error: 'Table name is required' }, { status: 400 });
    }
    
    // Validate table name to prevent SQL injection
    const validTables = [
      'users', 
      'buildings', 
      'properties', 
      'user_properties', 
      'maintenance_requests', 
      'comments', 
      'announcements', 
      'notifications'
    ];
    
    if (!validTables.includes(table)) {
      return NextResponse.json({ 
        error: 'Invalid table name. Must be one of: ' + validTables.join(', ') 
      }, { status: 400 });
    }
    
    // Build the query based on the provided parameters
    let dbQuery = supabase.from(table).select('*');
    
    // Apply filters if provided in the query object
    if (query && typeof query === 'object') {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          dbQuery = dbQuery.eq(key, value);
        }
      });
    }
    
    // Apply limit
    if (limit && !isNaN(Number(limit))) {
      dbQuery = dbQuery.limit(Number(limit));
    }
    
    // Execute the query
    const { data, error, count } = await dbQuery;
    
    if (error) {
      console.error(`Error querying ${table}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      table,
      count: data?.length || 0,
      data: data || []
    });
  } catch (error) {
    console.error('Error in database query API:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

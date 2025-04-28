import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Check if environment variables are set
    const envStatus = {
      supabaseUrl: supabaseUrl ? 'Set' : 'Not set',
      supabaseAnonKey: supabaseAnonKey ? 'Set' : 'Not set',
      supabaseServiceKey: supabaseServiceKey ? 'Set' : 'Not set',
    };
    
    // Test anon key client
    let anonKeyStatus = 'Not tested';
    let anonKeyError = null;
    
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const anonClient = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await anonClient.from('maintenance_requests').select('count').limit(1);
        
        if (error) {
          anonKeyStatus = 'Error';
          anonKeyError = error.message;
        } else {
          anonKeyStatus = 'Working';
        }
      } catch (error) {
        anonKeyStatus = 'Exception';
        anonKeyError = error instanceof Error ? error.message : String(error);
      }
    }
    
    // Test service role key client
    let serviceKeyStatus = 'Not tested';
    let serviceKeyError = null;
    
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
        const { data, error } = await serviceClient.from('maintenance_requests').select('count').limit(1);
        
        if (error) {
          serviceKeyStatus = 'Error';
          serviceKeyError = error.message;
        } else {
          serviceKeyStatus = 'Working';
        }
      } catch (error) {
        serviceKeyStatus = 'Exception';
        serviceKeyError = error instanceof Error ? error.message : String(error);
      }
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envStatus,
      anonKey: {
        status: anonKeyStatus,
        error: anonKeyError
      },
      serviceKey: {
        status: serviceKeyStatus,
        error: serviceKeyError
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

# Supabase Integration for Strata Management System

This document outlines the integration of Supabase as the database backend for the Strata Management System.

## Overview

The application has been migrated from PostgreSQL (with Prisma) to Supabase for easier deployment and management on Vercel. Supabase provides a fully-managed PostgreSQL database with a user-friendly dashboard and built-in authentication.

## Database Schema

The database schema is defined in `/supabase/schema.sql` and includes the following tables:

- `users`: Strata managers, administrators, and residents
- `buildings`: Properties managed by the strata company
- `properties`: Individual units within buildings
- `user_properties`: Relationship between users and properties
- `maintenance_requests`: Maintenance requests submitted by residents
- `comments`: Comments on maintenance requests
- `announcements`: Building-wide announcements
- `notifications`: User-specific notifications

## API Integration

The API routes have been updated to use the Supabase client:

- `/api/maintenance`: CRUD operations for maintenance requests
- `/api/announcements`: CRUD operations for building announcements
- `/api/notifications`: CRUD operations for user notifications
- `/api/test-supabase`: Test endpoint to verify Supabase connection

## Setup Instructions

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Run the SQL schema in the SQL editor to set up tables
4. Get your Supabase URL and anon key from the API settings
5. Set the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key

## Local Development

For local development, create a `.env.local` file with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

The API testing page at `/api-test` has been updated to test the Supabase integration. It includes:

- Test buttons for maintenance requests, notifications, and announcements
- A specific test for the Supabase connection
- Real-time logging of API responses

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file has been updated to include the necessary environment variables for Supabase.

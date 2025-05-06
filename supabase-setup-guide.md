# Supabase Setup Guide for Ozurso Volleyball App

This guide will walk you through setting up Supabase for the Ozurso Volleyball App.

## Step 1: Create a Supabase Account and Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project 
3. Note your project URL and API key (you'll need these later)

## Step 2: Set Up Database Tables

1. In your Supabase dashboard, navigate to the SQL Editor
2. Copy the contents of `supabase-setup.sql` from this repository
3. Paste and run the SQL script in the Supabase SQL Editor

This script will:
- Create the `players` table with necessary columns
- Add sample data (optional)
- Set up Row Level Security (RLS) policies
- Create helpful views and functions for calculating player scores

## Step 3: Configure Authentication (Optional)

If you want to add authentication later:

1. Navigate to Authentication > Settings in your Supabase Dashboard
2. Enable the authentication providers you want to use (Email, Google, etc.)
3. Configure redirect URLs for your deployed application

## Step 4: Get Your Supabase Credentials

1. Go to Project Settings > API in your Supabase Dashboard
2. Copy your project URL (looks like: `https://xyzproject.supabase.co`)
3. Copy your project's `anon` public key

## Step 5: Configure Your Application

Add these credentials as environment variables:

- In development (Replit): Add these to your `.env` file
```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
```

- In production (Vercel): Add these in the Vercel dashboard under Environment Variables

## Database Schema Details

### Players Table

| Column       | Type         | Description                                  |
|--------------|--------------|----------------------------------------------|
| id           | SERIAL       | Primary key, auto-incrementing               |
| name         | TEXT         | Player's name (required)                     |
| photo_url    | TEXT         | URL to player's profile picture              |
| skills       | JSONB        | JSON object with 7 skill ratings (1-10)      |
| average_score| NUMERIC      | Average of all skills, auto-calculated       |

### Skills JSON Structure

```json
{
  "saque": 8,      // Serve rating (1-10)
  "recepcao": 7,   // Reception rating (1-10)
  "passe": 8,      // Pass rating (1-10)
  "ataque": 9,     // Attack rating (1-10)
  "bloqueio": 7,   // Block rating (1-10)
  "defesa": 6,     // Defense rating (1-10)
  "mobilidade": 8  // Mobility rating (1-10)
}
```

## Using Supabase in Your App

The application is already configured to use Supabase with the client set up in:
- `client/src/lib/supabase.ts` - Client initialization
- `client/src/hooks/use-supabase-players.ts` - Custom hooks for CRUD operations

## Data Security Notes

- Row Level Security (RLS) is enabled by default
- Anonymous users can only read data
- Authenticated users can perform all operations (create, read, update, delete)
- The app doesn't require authentication by default, but you can add it later

## Troubleshooting

- If you encounter errors with JSONB data, ensure your JSON structure exactly matches the expected format
- For permission errors, check your RLS policies and API key permissions
- For deployment issues, verify that your environment variables are correctly set
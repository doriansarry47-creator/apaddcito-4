# Database Initialization Guide

## Problem
The error "relation 'users' does not exist" indicates that the PostgreSQL database is empty and tables haven't been created yet.

## Solutions

### Option 1: Using the Standalone Script (Recommended)
Run the database initialization script directly:

```bash
npm run db:init
```

This script will:
- Connect to your PostgreSQL database
- Create all necessary tables (users, exercises, craving_entries, etc.)
- Verify the tables were created successfully

### Option 2: Using Drizzle Kit
If you have network access to your database, use Drizzle's migration system:

```bash
# Push the schema to the database
npm run db:push
```

### Option 3: Using the API Endpoint
If you have the server running, you can call the initialization endpoint:

```bash
# Start the server
node simple-server.js

# In another terminal, initialize the database
curl http://localhost:3000/api/init-db
```

## Tables Created

The initialization process creates these tables:
- ✅ `users` - User accounts and profiles
- ✅ `exercises` - Available exercises
- ✅ `psycho_education_content` - Educational content
- ✅ `craving_entries` - User craving logs
- ✅ `exercise_sessions` - Exercise session records
- ✅ `beck_analyses` - Beck column analyses
- ✅ `user_badges` - User achievement badges
- ✅ `user_stats` - User statistics and progress

## Environment Setup

Make sure your `.env` file contains:
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

## Troubleshooting

### Network Connection Issues
If you get "ENOTFOUND" errors, check:
1. Your internet connection
2. Database server is accessible
3. DATABASE_URL is correct
4. Database server is not blocking your IP

### Permission Issues
Make sure your database user has CREATE TABLE permissions.

### Already Exists Errors
The scripts use `CREATE TABLE IF NOT EXISTS`, so they're safe to run multiple times.
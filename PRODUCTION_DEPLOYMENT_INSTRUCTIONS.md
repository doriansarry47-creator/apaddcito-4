# Production Deployment Instructions for PostgreSQL "user" Table Fix

## Quick Summary
This fix addresses the PostgreSQL error: **"relation 'user' does not exist"** by ensuring consistent use of the "users" table name (avoiding the PostgreSQL reserved keyword "user").

## Pre-Deployment Checklist

### 1. Backup Your Database
```bash
# For Neon/PostgreSQL
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Test the Fix (Development/Staging)
```bash
# Start server and test diagnostic endpoint
npm run dev
curl http://localhost:3000/api/diagnose-user-table

# Expected response for healthy database:
# {"status":"ok","tables_found":["users"],"has_user_table":false,"has_users_table":true,"recommendations":["Table naming is correct (\"users\" table exists)"]}
```

## Production Deployment Steps

### Step 1: Deploy Code Changes
Deploy the updated code to your production environment (Vercel, etc.)

### Step 2: Run Database Diagnostic
```bash
# Check production database status
curl https://your-app.vercel.app/api/diagnose-user-table
```

### Step 3: Apply Migrations (if needed)
```bash
# If using the migration system
npm run db:push

# Or manually run the fix migration
psql $DATABASE_URL -f migrations/0002_fix_user_table_naming.sql
```

### Step 4: Verify Fix
```bash
# Test authentication endpoints
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'

# Should return success without "relation user does not exist" error
```

## Troubleshooting Common Scenarios

### Scenario 1: Database Has "user" Table
If diagnostic shows: `"has_user_table": true, "has_users_table": false`

**Solution:**
1. The migration will automatically rename "user" to "users"
2. All foreign keys will continue to work
3. No data loss occurs

### Scenario 2: Both "user" and "users" Tables Exist
If diagnostic shows: `"has_user_table": true, "has_users_table": true`

**Manual Action Required:**
1. Determine which table has the correct data
2. Merge data if both contain important information
3. Drop the conflicting table
4. Run diagnostic again to verify

### Scenario 3: No User Tables Found
If diagnostic shows: `"tables_found": []`

**Solution:**
1. Run database initialization: `npm run db:push`
2. Or visit `/api/init-db` endpoint to create tables
3. Run diagnostic again to verify

## Verifying the Fix Works

### 1. Authentication Should Work
```bash
# Registration
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### 2. Database Queries Should Execute
```bash
# Test database connection
curl https://your-app.vercel.app/api/test-db

# Should return: {"ok":true,"result":[{"one":1}]}
```

### 3. No PostgreSQL Errors in Logs
Check your application logs for:
- ✅ No "relation 'user' does not exist" errors
- ✅ Successful authentication operations
- ✅ Clean database query execution

## Rollback Plan (if needed)

If issues occur, you can rollback by:

1. **Restore database backup:**
   ```bash
   psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
   ```

2. **Revert code deployment** in Vercel/hosting platform

3. **Re-run diagnostic** to confirm state

## Long-term Prevention

1. **Always use "users" table name** in new code
2. **Use the diagnostic endpoint** `/api/diagnose-user-table` for health checks
3. **Run migrations** through proper deployment pipeline
4. **Monitor logs** for any PostgreSQL reserved keyword issues

## Support Contacts

If you encounter issues during deployment:
1. Check diagnostic endpoint: `/api/diagnose-user-table`
2. Review logs for specific error messages
3. Use the troubleshooting guide above
4. Restore from backup if necessary

---

**⚠️ Important:** Always test in staging environment before production deployment!
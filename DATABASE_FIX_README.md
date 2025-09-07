# Database Table Naming Fix for PostgreSQL

## Problem
This repository addresses the PostgreSQL error: **"relation 'user' does not exist"**.

## Root Cause
PostgreSQL treats "user" as a reserved keyword, which can cause issues when used as a table name. The error occurs when code tries to query a table named "user" instead of "users".

## Solution Implemented

### 1. Consistent Table Naming
- All database schemas use `"users"` (plural) table name
- Drizzle ORM definitions: `pgTable("users", ...)`
- Migration files create table as `"users"`
- All foreign key references point to `"users"`

### 2. Reserved Keyword Protection
- Table names are properly quoted in raw SQL: `"users"`
- Added validation utilities in `shared/table-validation.ts`
- Runtime checks prevent accidental use of "user" table name

### 3. Migration Safety
- Created migration `0002_fix_user_table_naming.sql` to handle existing "user" tables
- Safe renaming process that checks for conflicts
- Preserves data integrity during table rename

### 4. Diagnostic Tools
- Added endpoint `/api/diagnose-user-table` to check table status
- Script `scripts/fix-database.ts` for comprehensive diagnosis
- Automated detection of table naming conflicts

## Files Modified

### Core Schema Files
- `shared/schema.ts` - ✅ Already using `pgTable("users", ...)`
- `migrations/0000_medical_marvel_boy.sql` - ✅ Creates `"users"` table
- `migrations/0001_equal_wild_pack.sql` - ✅ Foreign keys reference `"users"`

### Server Files
- `simple-server.js` - Added table name protection and diagnostic endpoint
- `server/routes.ts` - Added diagnostic endpoint
- `shared/table-validation.ts` - New validation utilities

### New Files
- `migrations/0002_fix_user_table_naming.sql` - Migration to fix existing issues
- `scripts/fix-database.ts` - Diagnostic and repair tool

## Usage

### Check Database Status
```bash
curl http://localhost:3000/api/diagnose-user-table
```

### Run Database Fix (if needed)
```bash
tsx scripts/fix-database.ts --fix
```

### Apply Migrations
```bash
npm run db:push
```

## Prevention

1. **Always use "users" table name** - Never create a table named "user"
2. **Quote table names in raw SQL** - Use `"users"` in manual queries
3. **Run diagnostics** - Check `/api/diagnose-user-table` if issues arise
4. **Use ORM consistently** - Drizzle handles table naming correctly

## Testing the Fix

1. Start the server: `npm run dev`
2. Visit diagnostic endpoint: `http://localhost:3000/api/diagnose-user-table`
3. Should return: `{"status": "ok", "recommendations": ["Table naming is correct"]}`

## Production Deployment

For production databases that might have the "user" table issue:

1. **Backup your database first**
2. Run the diagnostic script: `tsx scripts/fix-database.ts`
3. If issues are found, run: `tsx scripts/fix-database.ts --fix`
4. Apply migrations: `npm run db:push`
5. Verify with diagnostic endpoint

## Error Prevention Checklist

- [x] Schema uses `pgTable("users", ...)`
- [x] Migrations create `"users"` table
- [x] Raw SQL queries use `"users"`
- [x] Foreign keys reference `"users"`
- [x] Diagnostic tools available
- [x] Migration path for existing issues
- [x] Documentation and prevention guide